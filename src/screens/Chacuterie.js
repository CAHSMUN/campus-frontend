
import React, { useEffect, useState } from 'react'


// array of committees
const comm = [
    "au",
    "business",
    "c40",
    "cis",
    "disec",
    "eas",
    "ecc",
    "fcc",
    "hcc",
    "ipc",
    "jcc_a",
    "jcc_b",
    "ngo",
    "sochum",
    "specpol",
    "women",
    "undp",
    "unesco",
    "unsc",
    "house",
    "who"
]

const pretty = [
    "AU",
    
    "Business",
    "C40",
    "CIS",
    "DISEC",
    "EAS",
    "ECC",
    "FCC",
    "HCC",
    "IPC",
    "JCC Bloc A",
    "JCC Bloc B",
    "NGO",
    "SOCHUM",
    "SPECPOL",
    "UN Women",
    "UNDP",
    "UNESCO",
    "UNSC",
    "US House of Rep.",
    "WHO"
]
// arrays of country
const all_countries = [
    ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cabo Verde", "Central African Republic", "Chad", "Comoros", "Côte d'Ivoire", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Republic of the Congo", "Rwanda", "Sahrawi Arab Democratic Republic", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"],
    ["JP Morgan Chase", "Goldman Sachs", "Citigroup", "Barclays", "Wirex", "Coinbase", "Square", "Antpool", "Berkshire Hathaway", "Industrial and Commercial Bank of China", "Mt. Gox", "PolyNetwork", "Sberbank", "Toronto-Dominion Bank", "PayPal", "Silvergate Capital", "Alibaba", "Amazon", "Nvidia", "HSBC"],
    ["Accra", "Addis Ababa", "Amman", "Amsterdam", "Athens", "Auckland", "Bangkok", "Barcelona", "Beijing", "Berlin", "Bogotá", "Boston", "Buenos Aires", "Chicago", "Copenhagen", "Curitiba", "Delhi NCT", "Dhaka North", "Dubai", "Durban (eThekwini)", "Freetown", "Hangzhou", "Heidelberg", "Ho Chi Min City", "Hong Kong", "Houston", "Istanbul", "Jakarta", "Johannesberg", "Karachi", "Kuala Lumpur", "Lagos", "Lima", "Lisbon", "London", "Los Angeles", "Madrid", "Melbourne", "Mexico City", "Milan", "Moscow", "Mumbai", "Nairobi", "New Orleans", "New York", "Oslo", "Paris", "Phoenix", "Qingdao", "Quebec", "Quezon City", "Quito", "Rio de Janeiro", "Rome", "Rotterdam", "San Francisco", "Santiago", "São Paulo", "Seattle", "Seoul", "Shenzhen", "Singapore", "Stockholm", "Sydney", "Tel Aviv - Yafo", "Tokyo", "Toronto", "Vancouver", "Warsaw", "Washington, DC"],
    ["Armenia A", "Armenia B", "Azerbaijan A", "Azerbaijan B", "Belarus A", "Belarus B", "Kazakhstan A", "Kazakhstan B", "Kyrgyzstan A", "Kyrgyzstan B", "Moldova A", "Moldova B", "Russian Federation A", "Russian Federation B", "Tajikistan A", "Tajikistan B", "Uzbekistan A", "Uzbekistan B"],
    ["Algeria", "Afghanistan", "Australia", "Austria", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Brazil", "Bulgaria", "Burundi", "Cambodia", "Canada", "Colombia", "Côte d'Ivoire", "Croatia", "Cuba", "Czech Republic", "Democratic People's Republic of Korea", "Democratic Republic of Congo", "Denmark", "Djibouti", "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Kenya", "Lebanon", "Libya", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Mexico", "Morocco", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Papua New Guinea", "People's Republic of China", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Republic of Korea", "Romania", "Russian Federation", "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Sudan", "Spain", "Sudan", "Sweden", "Switzerland", "Thailand", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Vietnam", "Yemen", "Zimbabwe"],
    ["Australia A", "Australia B", "Brunei A", "Brunei B", "Cambodia A", "Cambodia B", "China A", "China B", "India A", "India B", "Indonesia A", "Indonesia B", "Japan A", "Japan B", "Laos A", "Laos B", "Malaysia A", "Malaysia B", "Myanmar A", "Myanmar B", "New Zealand A", "New Zealand B", "Philippines A", "Philippines B", "Republic of Korea A", "Republic of Korea B", "Russia A", "Russia B", "Singapore A", "Singapore B", "Thailand A", "Thailand B", "United States A", "United States B", "Vietnam A", "Vietnam B"],
    ["Position 1", "Position 2", "Position 3", "Position 4", "Position 5", "Position 6", "Position 7", "Position 8", "Position 9", "Position 10", "Position 11", "Position 12", "Position 13", "Position 14", "Position 15", "Position 16", "Position 17", "Position 18", "Position 19", "Position 20", "Position 21", "Position 22", "Position 23", "Position 24", "Position 25", "Position 26", "Position 27", "Position 28", "Position 29", "Position 30"],
    ["Agent Champagne", "Agent Gin", "Agent Tequila", "Agent Whiskey", "Arthur", "Brandy", "Cider", "Cognac", "Downing Street Chief of Staff", "Eggsy (Galahad)", "Gawain", "General Mccoy", "Ginger Ale", "Harry Hart (Formerly Galahad)", "Lancelot", "Merlin", "Percival", "President of the United States", "Prime Minister of the United Kingdom", "Secretary of Defence"],
    ["Alexander Hamilton", "Benjamin Franklin", "Benjamin Harrison", "Benjamin Rush", "George Mason", "George Washington", "Gouverneur Morris", "James Madison", "James Monroe", "John Adams", "John Dickinson", "John Hancock", "John Jay", "John Marshall", "Marquis de Lafayette", "Patrick Henry", "Richard Henry Lee", "Roger Sherman", "Samuel Adams", "Thomas Jefferson", "Thomas Paine"],
    ["New York Times", "CNN", "Xinhua News Agency", "The Onion", "The Globe and Mail", "Fox News", "Russia Today", "Al Jazeera", "BBC", "Euronews"],
    ["Tsar of Russia: Peter the Great", "Russian Generalissimo: Aleksander Danilovich Menshikov", "Russian Field Marshal: Boris Petrovich Sheremetev", "Russian Foreign Minister: Yemelyan Ignatievich Ukraintsev", "Russian Admiral: Fyodor Matveyevich Apraksin", "King of Poland: Grand Duke of Lithuania, and Elector of Saxony: Augustus II", "Polish Colonel: Stanisław Chomętowski", "Polish–Lithuanian Field Marshal: Michał Serwacy Wiśniowiecki", "King of Denmark and Norway: Frederick IV", "Danish Admiral: Ulrik Christian Gyldenløve", "Danish Major General: Jørgen Rantzau", "King of Prussia and Elector of Brandenburg: Frederick William I", "Prussian Field Marshal: Leopold I", "Prussian Prime Minister: Johann Kasimir Kolbe von Wartenberg", "Prussian Field Marshal: Friedrich Wilhelm von Grumbkow"],
    ["King of Sweden: Charles XII", "King of England, Scotland, and Ireland: William III", "Polish Nobleman: Stanisław Leszczyński", "Swedish Generalissimo: Frederick I", "Swedish Marshal of the Realm: Carl Piper", "Duke of Hostein-Gottorp: Frederick IV", "Swedish Field Marshal: Carl Gustav Rehnskiöld", "Polish Nobleman: Józef Potocki", "Swedish Field Marshal: Magnus Stenbock", "Grand Hetman of Lithuania: Jan Kazimierz Sapieha the Younger", "Hetman of Zaporizhian Host: Ivan Mazepa", "Hetman of Ukraine: Pylyp Orlyk", "Swedish General: Adam Ludwig Lewenhaupt", "Swedish Admiral-General: Hans Wachtmeister", "Ottoman Foreign Minister: Rami Mehmed Pasha"],
    ["Partners in Health", "Root Capital", "Cure Violence", "Mercy Corps", "Acumen Fund", "Care International", "International Red Cross and Red Crescent Movement", "Humans Rights Watch", "Amnesty International", "Ceres"],
    ["Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bangladesh", "Belgium", "Benin", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Brunei", "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "Colombia", "Côte D'Ivoire", "Croatia", "Czech Republic", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Egypt", "Eritrea", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Hungary", "India", "Indonesia", "Iraq", "Ireland", "Islamic Republic of Iran", "Israel", "Italy", "Jamaica", "Japan", "Kazakhstan", "Kenya", "Kuwait", "Laos", "Lativa", "Liberia", "Lithuania", "Madagascar", "Malaysia", "Mali", "Mexico", "Mongolia", "Morocco", "Myanmar", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "People's Republic of China", "Peru", "Philippines", "Poland", "Portugal", "Republic of Korea", "Republic of the Congo", "Romania", "Russian Federation", "Rwanda", "Saudi Arabia", "Singapore", "South Africa", "Spain", "Sweden", "Switzerland", "Thailand", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uzbekistan", "Vietnam", "Yemen"],
    ["Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Australia", "Austria", "Bangladesh", "Belarus", "Belgium", "Brazil", "Bulgaria", "Cambodia", "Canada", "Chad", "Chile", "Colombia", "Costa Rica", "Cuba", "Czech Republic", "Democratic People's Republic of Korea", "Democratic Republic of the Congo", "Denmark", "Dominican Republic", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Germany", "Greece", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Latvia", "Libya", "Luxembourg", "Madagascar", "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway", "Pakistan", "Panama", "People's Republic of China", "Philippines", "Poland", "Portugal", "Republic of Korea", "Romania", "Russian Federation", "Saudi Arabia", "Singapore", "Somalia", "South Africa", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Tanzania", "Thailand", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Venezuela", "Vietnam", "Yemen", "Zimbabwe"],
    ["Afghanistan", "Algeria", "Australia", "Austria", "Bangladesh", "Bhutan", "Brazil", "Burundi", "Canada", "China", "Democratic Republic of the Congo", "Ethiopia", "Finland", "France", "Germany", "Greece", "Haiti", "Hungary", "Iceland", "India", "Iran", "Iraq", "Italy", "Jordan", "Kenya", "Latvia", "Lebanon", "Mexico", "Mozambique", "New Zealand", "Nicaragua", "Nigeria", "Pakistan", "Phillipines", "Poland", "Russian Federation", "Saudi Arabia", "Somalia", "South Africa", "South Korea", "Spain", "Sweden", "Switzerland", "Thailand", "Tunisia", "Turkey", "United Kingdom", "United States", "Venezuela", "Yemen"],
    ["Australia", "Austria", "Algeria", "Bangladesh", "Belarus", "Belgium", "Botswana", "Brazil", "Bulgaria", "Cameroon", "Canada", "China", "Colombia", "Cuba", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Gambia", "Germany", "Greece", "Guatemala", "Hungary", "India", "Indonesia", "Iran", "Italy", "Japan", "Kuwait", "Mexico", "New Zealand", "Nigeria", "Norway", "Peru", "Republic of Korea", "Russian Federation", "Rwanda", "Somalia", "South Africa", "Spain", "Sweden", "Switzerland", "Thailand", "The Netherlands", "Turkey", "Ukraine", "United Kingdom", "United States", "Vanuatu"],
    ["Afghanistan", "Australia", "Azerbaijan", "Bangladesh", "Belgium", "Bolivia", "Brazil", "Cameroon", "Canada", "China", "Croatia", "Denmark", "Ecuador", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece", "Iceland", "India", "Indonesia", "Iran", "Italy", "Japan", "Kenya", "Lithuania", "Madagascar", "Malaysia", "Mexico", "Netherlands", "Nigeria", "Norway", "Pakistan", "Papua New Guinea", "Peru", "Portugal", "Romania", "Russian Federation", "Rwanda", "Saudi Arabia", "Serbia", "Singapore", "Slovenia", "Somalia", "South Africa", "Spain", "Sweden", "Switzerland", "Philippines", "Tunisia", "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Venezuela", "Vietnam", "Zimbabwe"],
    ["Albania", "Brazil", "China", "France", "Gabon", "Ghana", "India", "Ireland", "Kenya", "Mexico", "Norway", "Russia", "United Arab Emirates", "United Kingdom", "United States of America"],
    ["Terri Sewell (D-AL, 7th district)*", "Don Young (R-AK, 1st district)*", "Ruben Gallego (D-AZ, 7th district)*", "Carlos A. Gimenez (R-FL, 26th district)", "Speaker of the House of Representatives — Nancy Pelosi (D-CA, 12th district)*", "Bill Foster (D-IL, 11th district)", "House Minority Leader — Kevin McCarthy (R-CA, 23rd district)*", "Majority Leader of the United States House of Representatives — Steny Hoyer (D-MD, 5th district)", "Victoria Spartz (R-IN, 5tth district)", "Maxine Waters (D-CA, 43rd district)*", "Jim Himes (D-CT, 4th district)", "Frederica Wilson (D-FL, 24th district)", "Gregory Steube (R-FL,17th district)*", "Mark Takano (D-CA, 41st district)", "James Baird (R-IN, 4th district)", "Randy Feenstra (R-IA, 4th district)", "Raul Grijalva (D-AZ, 3rd district)", "Kweisi Mfume (D-MD, 7th district)", "Haley M. Stevens (D-MI, 11th district)", "House Minority Whip — Steve Scalise (R-LA, 1st district)", "Joe Wilson (R-SC, 2nd district)", "House Majority Leader — Steny Hoyer (D-MA, 5th district)", "Ayanna Pressley (D-MA, 7th district)", "Ilhan Omar (D-MN, 5th district)*", "Chair Suzanne Bonamici (D-OR, 1st district)", "Frederica S. Wilson (D-FL, 24th district)", "Virginia Foxx (R-NR, 5th district)", "Robert C. Bobby Scott (D-VA, 3rd district)", "Jahana Hayes (D-CT, 5th district)", "Mark DeSaulnier (D-CA, 11th district)", "Donald Norcross (D-NJ, 1st district)", "Dan Newhouse (R-WA, 4th district)", "Susan Wild (D-PA, 7th district)", "Scott Fitzgerald (R-WI, 5th district)", "Julia Letlow (R-LA, 5th district)", "Fred Keller (R-PA, 12th district)", "Burgess Owens (R-UT, 4th district)", "Tim Walberg (R-MI, 7th district)", "Kweisi Mfume (D-MD, 7th district)", "Jamaal Bowman (D-NY, 16th district)", "Joaquin Castro (D-TX, 20th district)", "Carolyn B. Maloney (D-NY, 12th district)", "Gregory W. Meeks (D-NY, 5th district)", "David Scott (D-GA, 13th district)", "Patrick McHenry (R-NC, 10th district)", "Trent Kelly (R-MS, 1st district)", "Tom McClintock (R-CA, 4th district)", "Glenn Grothman (R-WI, 6th district)", "Lloyd Smucker (R-PA, 11th district)", "Alma S. Adams (D-NC, 12th district)", "Alexandria Ocasio-cCortez (D-NY, 14th district)", "Donald Norcross (D-NJ, 1st district)", "Eleanor Holmes Norton (D-DC, 1st district)", "Eddie Bernice Johnson (D-TX, 30th district)", "Rick Larsen (D-WA, 2nd district)", "Thomas Massie (R-KY, 4th district)", "Daniel Webster (R-FL, 11th district )", "Scott Perry (R-PA, 10th district)", "David Rouzer (R-NC, 7th district)", "Doug LaMalfa (R-CA, 1st district)", "Nydia Velázquez (D-NY, 7th district)", "Alex Mooney (R-WV, 2nd district)", "Blaine Luetkemeyer (R-MO, 3rd district)", "Roger Williams (R-TX, 25th district)", "Jim Hagedorn (R-MN, 1st district)", "Sharice Davids (D-KS, 3rd district)", "Morgan Griffith (R-VA, 9th district)", "Claudia Tenney (R-NY, 22nd district)", "Byron Donalds (R-FL,19th district)", "Andrew Garbarino (R-NY, 2nd district)"],
    ["Afghanistan", "Algeria", "Argentina", "Austria", "Bangladesh", "Belarus", "Belgium", "Brazil", "Brunei", "Cambodia", "Canada", "Chad", "Chile", "China", "Colombia", "Congo", "Costa Rica", "Cote D Ivoire", "Croatia", "Cuba", "Czech Republic", "Denmark", "Dominican Republic", "DRC", "Ecuador", "Egypt", "Ethiopia", "Finland", "France", "Germany", "Ghana", "Greece", "Haiti", "Honduras", "Hungary", "India", "Indonesia", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Kazahstan", "Kenya", "Laos", "Liberia", "Libya", "Madagascar", "Malaysia", "Maldives", "Mali", "Mexico", "Mongolia", "Morocco", "Mozambique", "Myanmmar", "Nepal", "Netherlands", "New Zealand", "Nigeria", "North Korea", "Norway", "Pakistan", "Peru", "Phillipines", "Poland", "Portugal", "Romania", "Russia", "Rwanda", "Senegal", "Serbia", "Sierra Leone", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sudan", "Sweden", "Switzerland", "Syria", "Tanzania", "Thailand", "Turkey", "UAE", "Uganda", "Ukraine", "United States", "Uruguay", "Venezuela", "Viet Nam", "Yemen"]
];


const Chacuterie = () => {
    const [display, setDisplay] = useState([])

    let large_ass_array = []

    for (let i = 0; i < comm.length; i++) {
        let committee_countries = []

        for (let j = 0; j < all_countries[i].length; j++) {
            committee_countries.push({
                name: all_countries[i][j],
                assigned: ""
            })
        }
        
        const committee_obj = {
            committee: pretty[i],
            countries: committee_countries
        };


        large_ass_array[i] = committee_obj;
    }


    useEffect(() => {
        let returnData = [];

        for(let i = 0; i < all_countries.length; i++) {

            let formatted = [];

            for(let j = 0; j < all_countries[i].length; j++) {
                formatted.push(
                    `"${all_countries[i][j]}"`
                )
            }

            returnData.push(
                <div style={{marginBottom:'1em'}}>
                    {`${pretty[i]}: [${formatted}]`}
                </div>
            )
        }

        setDisplay(returnData);
    }, [])

    return (
        display
    )
}

export default Chacuterie;