export default interface IUser
{
    email:string,
    password?:string, //making it optional to store in db // p.s will not store in db
    age:number,
    name:string,
    phoneNo:string
}