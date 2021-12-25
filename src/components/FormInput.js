import { TextField } from "@material-ui/core";


const FormInput = ({ label, required, value, onChange, type = "default", multiline = false, rows }) => (
    <TextField
        color='secondary'
        variant="outlined"
        margin="normal" 
        fullWidth  

        multiline={multiline}
        rows={multiline ? rows : 0}
        type={type}
        label={label}
        required={required}
        value={value} 
        onChange={onChange}
        />
)

export default FormInput;