import React, { useState, useEffect } from 'react'
import Pagination from '@mui/material/Pagination';

interface PaginationComponentProps {
    page: number
    onChange: (event: React.ChangeEvent<unknown>, value: number) => void
    className?: string
    total: number
    variant: "outlined" | "text"
    shape: "rounded" | "circular"
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ onChange, page, className, total, variant, shape }) => {

    const [count, setCount] = useState<number>(0)
    useEffect(() => {
        let count = total < 5 ? 1 : (total % 5) === 0 ? Math.floor(total / 5) : Math.floor((total / 5) + 1)
        setCount(count)
    }, [total])

    return (
        <Pagination page={page} onChange={onChange} className={className} count={count} variant={variant} shape={shape} />
    )
}

export default PaginationComponent