const DEV = true;

const API_URL = DEV ? 'http://localhost:8080' : 'https://api.cahsmun.org';

const STRIPE_KEY = DEV ? 'pk_test_4HfflbdwiXNK9C0a0BEhSHO200h2DSIEZd' : 'pk_live_QsVHlOazYKOg4m52Nona47s200YWABF3Qy'

const PAYMENTS = {
    test: {
        name: 'Test',
        price_id: 'price_1LkI8XGtvL665mVpzfXvCZL4',
    },
    early: {
        name: 'Early',
        price_id: 'price_1HlhAEGtvL665mVpykcBMmMt',
    },
    regular: {
        name: 'Regular',
        price_id: 'price_1HlhAYGtvL665mVpqyqlKJbh',
    },
    late: {
        name: 'Late',
        price_id: 'price_1HlhAsGtvL665mVp4MZPkxua',
    }
}

const getCurrentPayment = (periods) => {
    // times in periods object are deadlines (not starts)

    const floor = (epoch) => {
        return Math.floor(epoch / 1000)
    }

    const currentDate = floor(Date.now())
    
    const e = new Date(periods.early)
    const earlyReg = floor(e.getTime())

    const r = new Date(periods.regular)
    const regularReg = floor(r.getTime())

    const l = new Date(periods.late)
    const lateReg = floor(l.getTime())

    // console.log(`${new Date()}\n ${currentDate}\n ${e.toUTCString()}\n ${r.toUTCString()}\n ${l.toUTCString()}\n ${earlyReg}\n ${regularReg}\n ${lateReg}`)

    if (currentDate > lateReg) return null
    
    if (currentDate <= earlyReg) {
        return PAYMENTS.early
    }

    if (currentDate <= regularReg) {
        return PAYMENTS.regular
    }

    return PAYMENTS.late
}

export {
    API_URL, 
    PAYMENTS, 
    STRIPE_KEY, 
    getCurrentPayment 
};