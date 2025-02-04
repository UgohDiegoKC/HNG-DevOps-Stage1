const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Helper functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    let sum = 1;
    for (let i = 2; i * i <= num; i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const power = digits.length;
    const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);
    return sum === num;
};

const digitSum = (num) => num.toString().split("").reduce((acc, d) => acc + parseInt(d), 0);

const getNumberProperties = (num) => {
    let properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");
    return properties;
};

// API Endpoint
app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;

    if (!number || isNaN(number) || !Number.isInteger(Number(number))) {
        return res.status(400).json({ number, error: true });
    }

    const num = parseInt(number);
    const properties = getNumberProperties(num);
    const sum = digitSum(num);
    const funFactUrl = `http://numbersapi.com/${num}/math`;

    try {
        const { data: funFact } = await axios.get(funFactUrl);
        res.json({
            number: num,
            is_prime: isPrime(num),
            is_perfect: isPerfect(num),
            properties,
            digit_sum: sum,
            fun_fact: funFact,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch fun fact." });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
