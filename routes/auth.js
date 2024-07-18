const { default: axios } = require('axios')
const express = require('express')
const router = express.Router()
// const fetch = require();
router.get("/register", (req, res, next) => {
  return  res.render("pages/register")
})

router.get("/login", (req, res, next) => {
  return  res.render("pages/login")
})

router.get("/appointment/:id",async (req, res, next) => {
 try {
  console.log("Hello");
  const fetchList = await getAppoinmentById(req.params.id)
    // console.log(fetchList);
  return  res.render("pages/appointment",{
    bookings: fetchList
  })
  // return  res.render("pages/hello")

 } catch (error) {
  console.log(error);
 } 
})

router.post("/login", async (req, res, next) => {
  try {
      
   const data = await loginApiCall()
   console.log(data);
   const fetchEmail = await isEmailPresent(req.body.email, data,req.body.password)
   console.log(fetchEmail);
    
   res.redirect(`appointment/${fetchEmail.id}`)


  } catch (error) {
      console.log(error);
  }
})

router.post("/register", async (req, res, next) => {
    try {
        // console.log(req.body);
        // console.log("Api Call Start")
        // var request = require('request');
        const axios = require('axios');
        let data = JSON.stringify({
          "team_member": {
            "given_name": req.body.name,
            "family_name": req.body.lastname,
            "email_address": req.body.email,
          
            "status": "ACTIVE"
          }
        });
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://connect.squareup.com/v2/team-members',
          headers: { 
            'Authorization': 'Bearer EAAAlnoZ7rPkkZ-8_MWjXop79ohmW-qHBYV4vBV6wWytIH2Du0dG0ctcFLCjTzoT', 
            'Content-Type': 'application/json', 
            'Square-Version': '2024-06-04', 
            'Cookie': '__cf_bm=bmauAWkhkHYz59DVR7Kpv5zy2ZKLoCbG8qBZ3NmUHog-1720615682-1.0.1.1-eRdVHhTcR7f8tJainpWVEYVTkfP_EpH0WdPfbDyS8Owxdls0btiPP783UlonhAxOboecwni6svrzx.7Dq58a4g'
          },
          data : data
        };
        
        axios.request(config)
        .then((response) => {
            
            data1 = {
                "given_name": response.data.team_member.given_name,
            "family_name": response.data.team_member.family_name,
            "email_address": response.data.team_member.email_address,
            "id":response.data.team_member.id,
            "merchant_id":response.data.team_member.merchant_id,
            "status": "ACTIVE",
            "password": req.body.password,
            }
            let config1 = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://healthcare-50dcc-default-rtdb.firebaseio.com/user.json',                
                data : data1
              };
              axios.request(config1)
              .then((response1) => {
                
                res.render("pages/login");
                
                // response,
                
                    // console.log(response)
              })
        //   console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
        
        // res.render("pages/register")

    } catch (error) {
        console.log(error);
    }
})

function isEmailPresent(email, data ,password) {
  for (const key in data) {
    if (data[key].email_address === email &&  data[key].password === password) {
      userData = data[key];
      return data[key];
    }
  }
  return null;
}

const loginApiCall = async () => {
  try {
    const api = await axios.get("https://healthcare-50dcc-default-rtdb.firebaseio.com/user.json")
    // console.log(api.data);
    return api.data
  } catch (error) {
    
  }
}

const getAppoinmentById = async (id) => {
  try {
    const api = await axios.get(`https://connect.squareup.com/v2/bookings?customers=TM6StgDAPcG0SQ_-`,{
      headers:{
        'Authorization':'Bearer EAAAlnoZ7rPkkZ-8_MWjXop79ohmW-qHBYV4vBV6wWytIH2Du0dG0ctcFLCjTzoT',
        'Accept':"*/*"
      }
    })
    return api.data.bookings
  } catch (error) {
    console.log(error);
  }
}

module.exports = router