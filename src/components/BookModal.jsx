import React from 'react'

export const BookModal = ({ currSeats ,onBookSeats}) => {

    const totalPrice = () => {
        const price = currSeats.reduce((acc, seat) => {
            acc += seat.price
            return acc
        }, 0)
        return price
    }
    return (
        <div className="book-modal">
            {/* <h2>Row:{currSeat.location.y + 1}</h2>
            <h2>seat:{currSeat.location.x + 1}</h2> */}
            <h4>Price:{totalPrice()}$</h4>
            <button onClick={onBookSeats}>Book</button>
        </div>
    )
}
