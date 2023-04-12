import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

export default async function middleware(request: NextRequest, _next: NextFetchEvent) {
  const res = NextResponse.next();
  let ip = request.ip ?? request.headers.get('x-real-ip')
  const forwardedFor = request.headers.get('x-forwarded-for')
  if(!ip && forwardedFor){
    ip = forwardedFor.split(',').at(0) ?? 'Unknown'
  } 
  if(ip){
    
    const getCountry = async () => {
      const response = await fetch(`https://ipapi.co/json`)
      const countryCode = await response.json();

      console.log(getCountry)
      res.cookies.set("lang", countryCode.longitude, {httpOnly:false});
      res.cookies.set("lat", countryCode.latitude, {httpOnly:false});
    }

    getCountry()

    res.cookies.set("user-ip", ip, {
      httpOnly: false,
    });
  }

  return res;
}