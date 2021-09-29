from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model import Policy

from database import (
    get_all_policies,
    get_policy_by_id,
    update_policy_by_id
)

app = FastAPI()

origin = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_headers=['*'],
    allow_methods=['*'],
)


@app.get('/api/policy/all')
async def fetch_all_policies():
    return await get_all_policies()


@app.post('/api/policy/')
async def fetch_policy_by_id(data: Policy):
    response = await get_policy_by_id(data)
    if response:
        return response
    raise HTTPException(
        404, f"there is no policy with the {data.searchBy} id of {data.id}")


@app.put('/api/policy/update')
async def update_policy(data: Policy):
    response = await update_policy_by_id(data)
    if response:
        return response
    raise HTTPException(
        404, f"there is no policy with the {data.searchBy} id of {data.id}")
