export default defineEventHandler( async (event) => {
  
  if(event.node.req.method === 'GET') {
    let data = {}
    
    // fetch data from strapi
    await fetch('http://localhost:1337/api/products', {
      method: "GET",
      headers: {
        "Content-type": "application/json;charset=UTF-8",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjc2NjE4MjAzLCJleHAiOjE2NzkyMTAyMDN9.vIHc3ll9frUW6Kl94Uq7K2RRtKrq8Py4rWg8i2GAdQI"
      }
    })
    .then(response => response.json())
    .then(json => data = json)
    .catch(err => console.log(err));

    return {
      status: 200,
      body: data
    }
  }

  if(event.node.req.method === 'POST') {
    return {
      status: 200,
      body: {
        message: 'Hello World Post Method'
      }
    }
  }
 
})