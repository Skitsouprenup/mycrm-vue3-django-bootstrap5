# lets-chat-app-mern
A simple and responsive CRM app created using Vue3 as front-end framework and 
Django as back-end framework.

I have a demo video of this project in this [link](https://youtu.be/YRDMfVawP1U)

# Technologies Used
* **Bootstrap5**
* **Typescript**
* **Python3**
* **Vue3(Composition API)**
* **Django**
* **Stripe**
* **Vite**

# Testing this project
You can clone this project and test it for yourself. However, you need to create .env files
and add these following variables:

## Front-end
| Key                               | Description                    |
| --------------------------------- | :----------------------------: |
| **VITE_BASE_URL**                 | Base URL of the app            | 

## Back-end
| Key                                   | Description                                     |
| ------------------------------------- | :---------------------------------------------: |
| **SECRET_KEY**                        | Django secret key                               | 
| **STRIPE_PUB_KEY**                    | Stripe public key                               |
| **STRIPE_SECRET_KEY**                 | Stripe secret key                               |
| **STRIPE_SMALL_TEAM_PRICE_ID**        | "Small Team" Stripe product ID                  |
| **STRIPE_BIG_TEAM_PRICE_ID**          | "Big Team" Stripe product ID                    |
| **STRIPE_WEBHOOK_KEY**                | Stripe webhook key                              |
| **FRONTEND_URL_UPGRADE_PLAN_SUCCESS** | Front-end route used when payment is successful |
| **FRONTEND_URL_UPGRADE_PLAN_CANCEL**  | Front-end route used when payment is cancelled  |