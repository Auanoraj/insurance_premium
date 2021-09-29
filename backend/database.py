import motor
import motor.motor_asyncio

client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')

database = client.BCG
collection = database.insurance

collection.create_index("Policy_id", unique=True)


async def get_all_policies():
    policies = []
    data = collection.find({}, {'_id': 0})

    if data:
        async for document in data:
            policies.append(document)

        updated_key_list = [{k.strip().replace(' ', '_').lower(): v for k,
                             v in d.items()} for d in policies]

        return updated_key_list


async def get_policy_by_id(data):
    temp = data.dict()
    id = "_".join([temp['searchBy'].capitalize(), 'id'])

    policy = []
    data = await collection.find_one({id: data.id}, {'_id': 0})

    if data:
        policy.append(data)
        updated_key_list = [{k.strip().replace(' ', '_').lower(): v for k,
                             v in d.items()} for d in policy]
        return updated_key_list
    else:
        return data


async def update_policy_by_id(data):
    await collection.update_one({'Policy_id': data.id}, {'$set': {
        "Premium": data.premium
    }})

    policy = []
    data = await collection.find_one({'Policy_id': data.id}, {'_id': 0})

    if data:
        policy.append(data)
        updated_key_list = [{k.strip().replace(' ', '_').lower(): v for k,
                             v in d.items()} for d in policy]

        return updated_key_list
    else:
        return data
