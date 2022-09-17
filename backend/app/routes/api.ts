import { CurrencyController } from "../controllers/CurrencyController";

export class ApiRoutes {

    currencyController: CurrencyController = new CurrencyController();

    public routes(app: any): void {
        app.route('/currency-converter').post(this.currencyController.getCurrencyConverter);
    }
}