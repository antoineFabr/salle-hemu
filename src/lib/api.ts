import axios from "axios";

export const api = axios.create({
  baseURL: "https://salles.hemu-cl.ch/",
  timeout: 5000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:150.0) Gecko/20100101 Firefox/150.0'
  },
  maxRedirects: 0,
  validateStatus: (status) => status >= 200 && status <= 302
})
