
const modalStyles = {
    modalWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        width: 700,
        maxHeight: 1000,
        outline: 0,
        background: 'white',
        boxSizing: 'border-box'
    },
    modalSmall: {
        width: 500
    },
    modalActions: {
        display: 'flex',
        alignItems: 'center',
        padding: '1rem',
        justifyContent: 'space-between',
    },
    modalTop: {
        borderStyle: 'none none solid none',
        borderWidth: 1,
        borderColor: "#EEE",
    },
    modalBottom: {
        borderStyle: 'solid none none none',
        borderWidth: 1,
        borderColor: "#EEE",
    },
    modalContent: {
        padding: '1rem'
    },
}

export { modalStyles }