import React, { useState } from 'react'
import "./LoadMoreButton.scss"
import Loading from '../globals/loading/Loading'

interface LoadMoreButtonProps {
    total: number
    result: number
    handleLoadMore: () => any
    stopLoadMore: boolean
    onSearch?: boolean
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ result, total, handleLoadMore, stopLoadMore }) => {

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const loadMore = async () => {
        setIsLoading(true)
        await handleLoadMore()
        setIsLoading(false)
    }


    if (result >= total || stopLoadMore) return <></>;

    return (
        <div className="loadmore btn-primary" onClick={() => loadMore()}>
            {
                isLoading ? <Loading type='small' /> : <p>Xem thêm</p>
            }
        </div>
    )
}

export default LoadMoreButton