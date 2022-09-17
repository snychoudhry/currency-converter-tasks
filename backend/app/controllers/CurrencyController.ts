import { Request, Response, NextFunction } from "express"
import { Responder } from "../utils/responder";
import fetch, { Headers } from 'node-fetch'

export class CurrencyController {
    public getCurrencyConverter = async (request: Request, response: Response, next: NextFunction) => {
        let from: string = request.body.from;
        let to: string = request.body.to;
        let amount: number = request.body.amount;
        let myHeaders = new Headers();
        let apiKey: any = process.env.APIKEY
        myHeaders.append("apikey",  apiKey);

        let requestOptions : any= {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders
        };

        fetch("https://api.apilayer.com/exchangerates_data/convert?to=" + to + "&from=" + from + "&amount=" + amount, requestOptions)
            .then((response: any) => response.text())
            .then((result: any) => new Responder(request, response, next, true, 101, JSON.parse(result)))
    }

}