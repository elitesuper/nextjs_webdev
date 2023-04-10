import { useEffect, useState } from "react";
import cookies from "browser-cookies";

export const getDigitalRoot = (arg: number): number => {
    let DR = getSumOfEachDigits(arg)
    if (DR.toString().length == 1) {
        return DR
    }else {
        return getDigitalRoot(DR)
    }
}

const getSumOfEachDigits = (arg: number): number => {
    let length = arg.toString().length

    let sum = 0

    let number = arg

    for(let exp=0; exp<length; exp++) {
        let sumee = number % 10
        sum += sumee
        number -= sumee
        number /= 10
    }

    return sum
}