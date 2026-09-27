Your README.md should contain a description of your project along the following sections -

1. An outline of the application you were aiming to build, target users, data sources etc
Meal Masters is a web application designed to help everyday users quickly discover recipes and effortlessly plan meals for the week. The app curates recipes based on dietary preferences, allergies, and intolerances, making planning easier and accessible without pushing calorie-based fitness tracking or complicated sign-ups.

What we wanted to build - 
Our goal was to build a simple but powerful recipe platform that:
Allows users to search & browse recipes.
Lets users view detailed cooking info (ingredients, instructions, etc.)
Stores their saved recipes.
Helps plan meals across the week.
Tailors results based on diets, allergies & intolerances.

We aimed for an experience that:
Is clean and user-friendly.
Avoids the complexity of calorie tracking.
Supports students & casual home cooks who want structure without pressure.
Makes weekly planning quicker and more efficient.
This project concept originated from the list of suggested application ideas on iLearn. Our group liked the idea of a recipe app and naturally extended it into a weekly meal planner.

Data Sources & Stack - 
External API - We used Spoonacular API, chosen because it provides:
- Recipe images
- Ingredients
- Dietary metadata
- Detailed recipe instructions
- Good free tier (although limited to ~50 calls/day)
- Drawback: Daily rate limit was challenging; multiple API keys were used during development

Backend - Node.js / Express, MongoDB

Frontend - React + Vite

2. A description of what you have been able to implement in this MVP, use your milestones to highlight what you've achieved -

We were able to successfully meet the minimum feature goals.
At the time of submission, the following features are implemented:
- Authentication
- Browse recipes
- Save recipes for later
- View recipe detail page with ingredients + steps
- Search recipes bar
- Weekly meal planner
- Weekly meal overview table
- User dietary preferences stored via backend
- Recipe feed tailored to user’s preferences

Milestones we hit:
- Frontend–backend integration achieved by connecting React frontend with the Express.js and MongoDB backend for real-time data exchange; RESTful endpoints were defined
- User authentication system completed; implemented functionalities such as Login and Sign-up with secure credential validation, API communication, and storage of tokens in localStorage for session persistence
- Created user profile and preferences; designed a structure that enables users to save dietary needs and intolerances for the application to adjust the recipe recommendations according to the information coming from the backend
- Recipe browsing and saving: integrated recipe API, which allows users to browse, search, and save recipes that can be viewed later on the Saved Recipes section
- Meal planner feature: Implemented a weekly meal planner for users to assign breakfast, lunch, and dinner for every day of the week, displaying it dynamically in a grid manner
- User interface polish and responsiveness: adjusted CSS, routing, and hash-based navigation for better performance in various browsers
- MVP final demo ready: Created and polished demo slides with a focus on authentication, ensured local server connectivity, and contributed to live testing and presentation delivery

Limitation: 
API limit - Spoonacular free tier (50/day) can temporarily block real-time testing

3. A guide to the project source code - where should we look for what you have done. 
Frontend: 
- App.jsx - hash-based router for all screens
- screens/LandingHome.jsx - introduction page
- screens/LoginScreen.jsx - user login functionalities
- screens/Signup.jsx - user signup functionalities
- screens/Home.jsx - recipe feed, search recipes
- screens/Saved.jsx - saved for later recipes + unsave
- screens/ProfileSetup.jsx - form to store diet/allergies/intolerances
- screens/MealPlanner.jsx - select from saved recipes and assign to day/meal
- screens/MyMealPlan.jsx - weekly overview table with clickable recipes 
- screens/Recipe.jsx - individual recipe details page
- Style.css - shared theme tokens and UI styling

Backend:
- index.js – server entry point; connects Express app to port 3001
- app.js – main Express configuration file; defines routes and middleware
- routes/login.js – handles user login requests and token validation
- routes/signup.js – processes new user registration and stores account details
- routes/profile.js – manages user dietary preferences, intolerances, and updates to their profile
- routes/recipes.js – handles API requests for recipe browsing, searching, and retrieving recipe details
- models/user.js – defines MongoDB schema for storing user credentials and preferences
- models/saved.js – defines MongoDB schema for users’ saved recipes
- models/mealplan.js – defines MongoDB schema for weekly meal plans and associated recipe titles
- utils/authentication.js – manages authentication headers and middleware for secure API requests
- utils/config.js – stores environment variables and MongoDB connection configuration
- package.json – defines backend dependencies and scripts

4.  A summary of what your next steps would be if you were to continue the project
If continued, the next development areas would be:

Grocery List Generator
- Automatically compile ingredients from chosen meals
- Future: integrate Woolworths/Coles API to link ingredients to carts

Fridge Mode
- User enters ingredients they have in their fridge; app suggests recipes based on them
- Also suggests missing ingredients to buy

Recommendation engine
- Suggest recipes based on past saves
- Suggest alternatives based on missing ingredients

5. A summary of the main roles and contributions of each team member and how you managed interaction and communication through the project

How we worked:
- Agile sprints tracked on Github Project Board (tasks, status)
- Discord for daily communication, seminar sessions and occasional calls for debugging/ tracking progress/ feature planning
- Branches per screen/feature - regular merges into main, frequent conflict resolution as we integrated

Roles and Contributions - 

Team Member + Contributions 

Krutika Enmulwar - develop the Meal Planner, Profile Setup, and Settings features of the Meal Masters app, focusing on implementing user preference management, local storage syncing, and dynamic meal plan generation to enhance personalisation and usability.                                                            
Joey Tran -  designed and developed the Landing Page, Home Page, and Saved Recipes sections of the Meal Masters app, while leading the overall website design to ensure a cohesive, modern, and user-friendly interface.
Kayley Tsui - develop and maintain the backend of the Meal Masters app, focusing on building and integrating the Express.js server, managing API requests from Spoonacular, and ensuring smooth data flow between the frontend and database.
Seohyung Yang (Julia) - developed the Meal Masters application’s login and sign-up features by implementing user authentication, using frontend and backend validation of credentials. Also assisted in ensuring secure data flow between the client interface and the Express server, and contributed to improving the overall usability of the authentication process.

6. A valid username / password that can be used for testing (should be here AND in the submission box)
Username: test
Password: password123
