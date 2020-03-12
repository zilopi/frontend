export interface Result {
    description: string;
    title: string;
    data_of_industry: string;
    location_focus: string;
    keywords: string;
    information_type: string;
    data_rating: string;
    price: Number;
    currency: string;
    code_index: string;
    uuid: string;
    mime: string;
    downloads: string;
    url: string;
    upload_date:Date
    total_numberof_ratings:Number,
    total_compounded_rating: Number,
    codes: {};
    uploaded_by:{
        first_name :string,
        last_name : string,
        email:string,
        phone_number:Number,
        country:string
    },
    extension:string
}
