import { NextResponse } from "next/dist/server/web/spec-extension/response";

export default function middleware(req :any){
    let verify = req.localStorage.getItem('isLoggedIn');
    let url = req.url

    if(!verify && url.includes('/dashboard')){
        return NextResponse.redirect('http://localhost:3000/')
    }
}