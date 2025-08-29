import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const USER_DETAILS = {
  full_name: "Manish_R", 
  birth_date: "23062004", 
  email: "manish2306j@gmail.com",
  roll_number: "22BCE3271",
};
function isAlphabet(char) {
    return /[a-zA-Z]/.test(char);
}

function isNumeric(char) {
    return /^\d+$/.test(char);
}

function isSpecialCharacter(char) {
    return !isAlphabet(char) && !isNumeric(char);
}

function createAlternatingCaps(alphabets) {
    let allChars = [];
    
    for (let item of alphabets) {
        for (let char of item) {
            if (isAlphabet(char)) {
                allChars.push(char.toLowerCase());
            }
        }
    }
    
    allChars.reverse();
    
    let result = '';
    for (let i = 0; i < allChars.length; i++) {
        if (i % 2 === 0) {
            result += allChars[i].toUpperCase();
        } else {
            result += allChars[i].toLowerCase();
        }
    }
    
    return result;
}


app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' must be an array"
            });
        }

        let odd_numbers = [];
        let even_numbers = [];
        let alphabets = [];
        let special_characters = [];
        let sum = 0;

        for (let item of data) {
            let itemStr = String(item);
            
            if (isNumeric(itemStr)) {
                let num = parseInt(itemStr);
                sum += num;
                
                if (num % 2 === 0) {
                    even_numbers.push(itemStr);
                } else {
                    odd_numbers.push(itemStr);
                }
            }
            else if (itemStr.split('').some(char => isAlphabet(char))) {
                alphabets.push(itemStr.toUpperCase());
            }
            else if (itemStr.split('').every(char => isSpecialCharacter(char))) {
                special_characters.push(itemStr);
            }
            else {
                for (let char of itemStr) {
                    if (isNumeric(char)) {
                        let num = parseInt(char);
                        sum += num;
                        
                        if (num % 2 === 0) {
                            even_numbers.push(char);
                        } else {
                            odd_numbers.push(char);
                        }
                    } else if (isAlphabet(char)) {
                        alphabets.push(char.toUpperCase());
                    } else if (isSpecialCharacter(char)) {
                        special_characters.push(char);
                    }
                }
            }
        }

        const concat_string = createAlternatingCaps(alphabets);

        const response = {
            is_success: true,
            user_id: `${USER_DETAILS.full_name}_${USER_DETAILS.birth_date}`,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: sum.toString(),
            concat_string: concat_string
        };

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});



app.get("/",(req,res)=>{
    res.end("Hosted on Express");
});

app.use('*', (req, res) => {
    res.status(404).json({
        is_success: false,
        error: "Endpoint not found"
    });
});

app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        is_success: false,
        error: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`BFHL API server is running on port ${PORT}`);
    console.log(`POST endpoint: http://localhost:${PORT}/bfhl`);
});

export default app;