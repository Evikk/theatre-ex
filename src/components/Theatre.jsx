import React, { useEffect, useRef, useState } from 'react'
import ReactTooltip from "react-tooltip";
import { theatreService } from '../services/theatre-service';
import { BookModal } from './BookModal'

export const Theatre = () => {
    const [seats, setSeats] = useState([])
    const [isModalOpen, setModalOpen] = useState(false)
    const [currSeats, setCurrSeats] = useState([])
    const [theatreSize, settheatreSize] = useState({ x: null, y: null })
    const timeoutId = useRef(null)

    const generateSeats = (size) => {
        var seats = [];
        for (var i = 0; i < size.x + 1; i++) {
            seats[i] = [];
            for (var j = 0; j < size.y; j++) {
                seats[i][j] = {
                    location: { x: i, y: j },
                    isBlank: i === (Math.floor(size.x / 2)) ? true : false,
                    isBooked: false,
                    price: Math.floor(Math.random() * 10),
                    isReserved: false
                }
            }
        }
        theatreService.setTheatre(seats)
        return seats;
    }


    useEffect(() => {
        const theatre = theatreService.query()
        if (theatre) setSeats(theatre)
        return () => {
            
        }
    }, [])

    const handleChange = (ev) => {
        const { value, name } = ev.target
        const theatreSizeCopy = { ...theatreSize }
        theatreSizeCopy[name] = +value
        settheatreSize(theatreSizeCopy)
    }

    const onSubmit = (ev) => {
        ev.preventDefault()
        setSeats(generateSeats(theatreSize))
    }


    const onReserveSeat = (seat) => {
        if (seat.isBlank) return
        clearTimeout(timeoutId.current)
        const { location } = seat
        const seatsCopy = [...seats]
        seatsCopy[location.x][location.y].isReserved = true
        setCurrSeats([...currSeats, seat])
        setSeats(seatsCopy)
        setModalOpen(true)
        timeoutId.current = setTimeout(() => {
            currSeats.forEach(seat => {
                seatsCopy[seat.location.x][seat.location.y].isReserved = false
            })

            setSeats(seatsCopy)
            setModalOpen(false)
            setCurrSeats([])
        }, 3000);
    }

    const onBookSeats = () => {
        clearTimeout(timeoutId.current)
        setModalOpen(false)
        const newSeats = [...seats]
        currSeats.forEach(seat => {
            newSeats[seat.location.x][seat.location.y].isReserved = false
            newSeats[seat.location.x][seat.location.y].isBooked = true
        })


        setCurrSeats([])
        setSeats(newSeats)
        theatreService.setTheatre(newSeats)
    }

    const getClass = (seat) => {
        if (seat.isBooked) return 'booked'
        if (seat.isBlank) return 'blank'
        if (seat.isReserved) return 'reserved'
        return ''
    }

    return (
        <div className="theatre-main-container">
            <div>
                <form onSubmit={onSubmit}>
                    <input type='number' name='y' onChange={handleChange} />
                    <input type='number' name='x' onChange={handleChange} />
                    <button>Create theatre</button>
                </form>
            </div>
            <div className="screen">
                Fast & furious 3 (Tokyo drift)
            </div>
            <div className="theatre-inner">
                {seats.map((row, rowIdx) => {
                    return <div key={rowIdx} className="row">
                        {row.map((seat, colIdx) => {
                            return <div key={colIdx}>
                                <div data-tip data-for={`${rowIdx}${colIdx}`} onClick={() => onReserveSeat(seat)} className={`seat ${getClass(seat)}`}>
                                </div>
                                <ReactTooltip id={`${rowIdx}${colIdx}`} place="top" effect="solid" >
                                    {`${seat.location.x + 1} / ${seat.location.y + 1}`}
                                </ReactTooltip>
                            </div>
                        })}
                    </div>
                })}
            </div>
            {isModalOpen && <BookModal currSeats={currSeats} onBookSeats={onBookSeats} />}
        </div>
    )
}
