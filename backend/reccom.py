from typing import Any,Dict
import logging
import os
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from langchain_groq import ChatGroq
import pickle
import faiss
def query_legal_case(
    query: str,
    db_dir = "./db",
    groq_api_key="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"
) -> Dict[str, Any]:
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s: %(message)s')
    logger = logging.getLogger(__name__)
    
    if groq_api_key:
        os.environ["GROQ_API_KEY"] = groq_api_key
    
    try:
        # Load stored data
        logger.info("Loading stored database...")
        index = faiss.read_index(os.path.join(db_dir, "legal_cases.index"))
        df = pd.read_pickle(os.path.join(db_dir, "processed_cases.pkl"))
        
        # Initialize models
        embedder = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")
        llm = ChatGroq(
            model="llama-3.1-70b-versatile",
            temperature=0.2,
            max_tokens=500,
            timeout=90,
            max_retries=3
        )
        
        # Process query
        logger.info("Processing query...")
        prompt = f"""
        Convert this legal query into a concise legal analysis request:
        Original Query: "{query}"

        Enhanced Legal Analysis Request:
        """
        processed_query = llm.invoke([("human", prompt)]).content.strip()
        
        # Search similar cases
        logger.info("Searching similar cases...")
        query_embedding = embedder.encode([processed_query])
        distances, indices = index.search(query_embedding, 3)
        
        similar_cases = []
        for idx in indices[0]:
            case = df.iloc[idx]
            case_prompt = f"""
            Provide a brief summary highlighting:
            - Key legal principles
            - Relevant context
            - Outcome of the case

            Case Description: {case['description']}
            """
            summary = llm.invoke([("human", case_prompt)])
            similar_cases.append({
                'summary': summary.content.strip(),
                'bail_status': case['Bail_Status']
            })
        
        # Generate recommendation
        logger.info("Generating recommendation...")
        decision_prompt = f"""
        Based on these case summaries, provide a direct bail decision recommendation:
        Case Summaries: {similar_cases}
        Original Query Context: {query}
        """
        decision = llm.invoke([("human", decision_prompt)])
        
        return {
            'query': query,
            'processed_query': processed_query,
            'similar_cases': similar_cases,
            'decision_recommendation': decision.content.strip()
        }
        
    except Exception as e:
        logger.error(f"Query error: {e}")
        return {'error': str(e)}
