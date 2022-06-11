import { ValidationErrors,AbstractControl,ValidatorFn} from "@angular/forms";
export class RegisterValidators {

    static match(controlName:string, matchingcontrolName:string) :ValidatorFn   {

        return(group:AbstractControl):ValidationErrors | null =>
        {
            const control = group.get(controlName)
            const matchingcontrol = group.get(matchingcontrolName)
    
            if(!control || !matchingcontrol)
            {
                console.log("Error cannot be found in form group")
                return {controlNotFound : false}
            }
    
            const error = control.value === matchingcontrol.value ? null : {nomatch :true}
    
            matchingcontrol.setErrors(error)
            return error
        }

    }
}
