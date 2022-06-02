import axios from "axios";

const axiosAPI = axios.create({
  baseURL: "https://api.mailjet.com/v3.1/send"
});

// implement a method to execute all the request from here.
const sendMail = (request) => {
  const headers = {
    authorization: "3c296ae9b608bfaa5d1738349b1e2809:f2e03f883376889a2e1b271a48e91c3d",
    'Content-Type': 'application/json'
  
  };

  const post: string = "post"

  //using the axios instance to perform the request that received from each http method
  return axiosAPI({
    method: post,
    data: request,
    headers
  }).then(res => {
    return Promise.resolve(res.data);
  })
    .catch(err => {
      return Promise.reject(err);
    });
}


// expose your method to other services or actions
const API = {
  sendMail
};
export default API;