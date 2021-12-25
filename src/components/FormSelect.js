import { 
    InputLabel,
    Select,
    FormControl
} from "@material-ui/core";


const FormSelect = ({ children, required, label, labelID, value, margin = "none", onChange }) => (
    // <TextField
    //     color='secondary'
    //     variant="outlined"
    //     margin="normal" 
    //     fullWidth  

    //     type={type}
    //     label={label}
    //     required={required}
    //     value={value} 
    //     onChange={onChange}
    //     />
    <FormControl fullWidth margin={margin}>
        <InputLabel  
            style={{
                lineHeight: '50%',
                paddingLeft: '1rem'
            }}
            color="secondary" 
            id={`${labelID}-select-label`}>
                {label}{required ? " *" : ""}
        </InputLabel>
        <Select
            variant="outlined"
            color="secondary"
            
            id={`${labelID}-select`}
            labelId={`${labelID}-select-label`}
            label={`${label}${required ? " *" : ""}`}
            value={value}
            onChange={onChange} >
            {children}
        </Select>
    </FormControl>
)

export default FormSelect;