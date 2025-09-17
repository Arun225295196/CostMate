// Victoria/Melbourne Cost of Living Data (2024)
const VictoriaData = {
    // Average costs in different Melbourne areas
    areaCosts: {
        'Melbourne CBD': {
            rent: { onebed: 2600, twobed: 3800, threebed: 5200 },
            coffee: 5.50,
            meal: 25,
            transport: 5.30,
            parking: 35,
            gym: 85,
            cinema: 24
        },
        'South Yarra': {
            rent: { onebed: 2400, twobed: 3500, threebed: 4800 },
            coffee: 5.20,
            meal: 28,
            transport: 5.30,
            parking: 25,
            gym: 95,
            cinema: 22
        },
        'St Kilda': {
            rent: { onebed: 2200, twobed: 3200, threebed: 4500 },
            coffee: 4.80,
            meal: 24,
            transport: 5.30,
            parking: 20,
            gym: 75,
            cinema: 20
        },
        'Fitzroy': {
            rent: { onebed: 2300, twobed: 3300, threebed: 4600 },
            coffee: 5.00,
            meal: 26,
            transport: 5.30,
            parking: 22,
            gym: 80,
            cinema: 21
        },
        'Richmond': {
            rent: { onebed: 2100, twobed: 3100, threebed: 4300 },
            coffee: 4.70,
            meal: 22,
            transport: 5.30,
            parking: 20,
            gym: 70,
            cinema: 20
        },
        'Brunswick': {
            rent: { onebed: 1900, twobed: 2800, threebed: 3900 },
            coffee: 4.50,
            meal: 20,
            transport: 5.30,
            parking: 15,
            gym: 65,
            cinema: 18
        },
        'Box Hill': {
            rent: { onebed: 1700, twobed: 2400, threebed: 3200 },
            coffee: 4.20,
            meal: 18,
            transport: 5.30,
            parking: 12,
            gym: 55,
            cinema: 16
        },
        'Geelong': {
            rent: { onebed: 1500, twobed: 2200, threebed: 2900 },
            coffee: 4.00,
            meal: 20,
            transport: 4.60,
            parking: 8,
            gym: 50,
            cinema: 15
        },
        'Ballarat': {
            rent: { onebed: 1400, twobed: 2000, threebed: 2700 },
            coffee: 3.80,
            meal: 18,
            transport: 3.80,
            parking: 5,
            gym: 45,
            cinema: 14
        },
        'Bendigo': {
            rent: { onebed: 1450, twobed: 2100, threebed: 2800 },
            coffee: 3.90,
            meal: 19,
            transport: 3.90,
            parking: 5,
            gym: 48,
            cinema: 14
        }
    },
    
    // Victorian average spending by category
    victorianAverages: {
        'Food': {
            single: 450,
            couple: 800,
            family: 1200,
            breakdown: {
                groceries: 60,
                eatingOut: 25,
                coffee: 10,
                delivery: 5
            }
        },
        'Transport': {
            single: 250,
            couple: 400,
            family: 550,
            breakdown: {
                myki: 40,
                fuel: 35,
                parking: 15,
                uber: 10
            }
        },
        'Entertainment': {
            single: 200,
            couple: 350,
            family: 450,
            breakdown: {
                streaming: 15,
                movies: 20,
                events: 40,
                sports: 25
            }
        },
        'Bills': {
            single: 180,
            couple: 250,
            family: 350,
            breakdown: {
                electricity: 35,
                gas: 20,
                water: 10,
                internet: 20,
                mobile: 15
            }
        },
        'Shopping': {
            single: 150,
            couple: 280,
            family: 420,
            breakdown: {
                clothing: 40,
                household: 30,
                personal: 20,
                other: 10
            }
        },
        'Health': {
            single: 120,
            couple: 200,
            family: 300,
            breakdown: {
                insurance: 40,
                medical: 25,
                pharmacy: 20,
                fitness: 15
            }
        }
    },
    
    // Melbourne-specific money saving tips
    melbourneTips: [
        "🚊 Get a Myki Pass instead of Myki Money - save up to $30/month on daily commutes",
        "☕ Join local coffee loyalty programs - most Melbourne cafes offer free coffee after 5-6 purchases",
        "🛒 Shop at Queen Victoria Market on Sunday afternoons for discounted fresh produce",
        "🍔 Check out Cheap Eats Melbourne guide for meals under $15 in the CBD",
        "🎭 Get last-minute theatre tickets at Half-Tix Melbourne for 50% off",
        "🚲 Use Melbourne Bike Share for short trips - cheaper than Uber for distances under 3km",
        "📚 Get free museum entry on certain days - Melbourne Museum free for concession card holders",
        "🏖️ Take free Circle Tram (Route 35) for CBD sightseeing instead of paid tours",
        "🍺 Happy hours in Melbourne: Most pubs offer 4-6pm or 5-7pm specials",
        "🛍️ DFO South Wharf and Spencer Outlet for discounted shopping",
        "⛽ Use PetrolSpy app to find cheapest fuel in your Melbourne suburb",
        "🏠 Consider share houses in inner suburbs - save $200-400/week on rent",
        "🎬 $10 movie tickets on Mondays at most Village/Hoyts cinemas",
        "🍕 Tuesday pizza deals across Melbourne - most places offer discounts",
        "📱 Belong Mobile uses Telstra network - great coverage in Victoria for half the price"
    ],
    
    // Suburb cost index (100 = Melbourne CBD average)
    suburbIndex: {
        'Toorak': 145,
        'South Yarra': 125,
        'Brighton': 130,
        'Melbourne CBD': 100,
        'St Kilda': 95,
        'Fitzroy': 98,
        'Richmond': 90,
        'Carlton': 92,
        'Prahran': 105,
        'Brunswick': 85,
        'Footscray': 75,
        'Box Hill': 70,
        'Glen Waverley': 72,
        'Dandenong': 65,
        'Werribee': 60,
        'Geelong': 55,
        'Ballarat': 50,
        'Bendigo': 52
    }
};

// Calculate cost comparison
function compareWithVictorianAverage(userSpending, category, household = 'single') {
    const average = VictoriaData.victorianAverages[category]?.[household] || 0;
    const difference = userSpending - average;
    const percentage = average > 0 ? ((difference / average) * 100).toFixed(1) : 0;
    
    return {
        average,
        difference,
        percentage,
        status: difference > 0 ? 'above' : difference < 0 ? 'below' : 'equal'
    };
}

// Get area-specific tips
function getAreaTips(area) {
    const areaData = VictoriaData.areaCosts[area];
    if (!areaData) return [];
    
    const tips = [];
    
    if (areaData.coffee > 5) {
        tips.push(`☕ Coffee in ${area} averages $${areaData.coffee}. Consider making coffee at home 3 days/week to save $${(areaData.coffee * 15).toFixed(0)}/month`);
    }
    
    if (areaData.parking > 20) {
        tips.push(`🚗 Parking in ${area} costs $${areaData.parking}/day. Use public transport to save $${(areaData.parking * 20).toFixed(0)}/month`);
    }
    
    if (areaData.meal > 23) {
        tips.push(`🍽️ Dining in ${area} averages $${areaData.meal}. Try lunch specials which are usually 30-40% cheaper`);
    }
    
    return tips;
}

module.exports = { VictoriaData, compareWithVictorianAverage, getAreaTips };