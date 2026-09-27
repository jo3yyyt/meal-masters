# Description of Deployment Process
This application uses Render to deploy both the frontend and backend. As they are located on separate web services, the first request from the frontend to the backend may have some delays as the instance has to be redeployed after a period of inactivity.

**Deployment Link:** https://meal-masters-u0qw.onrender.com/

# How to Build and Run
## In the `/back` folder:
**To run:**
1. `npm install`
2. `npm run server`

**.env file requires the following variables:**
- **API_KEY**: to access the external API (Spoonacular)
- **MONGO_URL**: to access the database, if required contact Kayley
- **JWT_SECRET**: for authentication purposes


**In the `/front` folder:**
1. ` npm install `
2. ` npm run dev `

**.env file requires the following variables:**
- VITE_URL = https://meal-masters-backend.onrender.com/
  - This is the backend URL

# Details of CI/CD
For CI/CD, Render will automatically redeploy the site when new changes have been pushed to this repository. However, as mentioned previously, the first request of the deployed site may take some time as Render must redeploy the site after a period of inactivity.