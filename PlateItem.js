export class PlateItem {
    constructor() {
        this.registration = "";
        this.frontPlate = {
            required: true,
            style: null,
            size: null,
            border: null,
            badge: null
        };
        this.rearPlate = {
            required: true,
            style: null,
            size: null,
            border: null,
            badge: null
        };
        this.roadLegal = true;
        this.totalPrice = 0;
    }

    setRegistration(registration) {
        this.registration = registration;
    }

    setFrontPlate(style, size, border, badge) {
        this.frontPlate.style = style;
        this.frontPlate.size = size;
        this.frontPlate.border = border;
        this.frontPlate.badge = badge;
    }

    setRearPlate(style, size, border, badge) {
        this.rearPlate.style = style;
        this.rearPlate.size = size;
        this.rearPlate.border = border;
        this.rearPlate.badge = badge;
    }

    // New method to add border
    addBorder(border) {
        this.frontPlate.border = border; // Update front plate border
        this.rearPlate.border = border;  // Update rear plate border

        console.log(this.frontPlate.badge);
        console.log(this.frontPlate.border);    
    }

    // New method to add badge
    addBadge(badge) {
        this.frontPlate.badge = badge;  // Update front plate badge
        this.rearPlate.badge = badge;   // Update rear plate badge
    }

    calculatePrice() {
        let basePrice = 22.49;
        this.totalPrice = (this.frontPlate.required ? basePrice : 0) + (this.rearPlate.required ? basePrice : 0);
        return this.totalPrice;
    }

    toggleRoadLegality() {
        this.roadLegal = !this.roadLegal;
    }

    getSummary() {
        return {
            registration: this.registration,
            frontPlate: this.frontPlate,
            rearPlate: this.rearPlate,
            roadLegal: this.roadLegal,
            totalPrice: this.calculatePrice()
        };
    }
}
