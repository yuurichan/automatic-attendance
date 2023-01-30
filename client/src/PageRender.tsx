import React from 'react'
import { useParams } from 'react-router-dom'
import { Params } from './utils/interface'
import NotFound from './components/globals/not-found/NotFound'

const generatePage = (name: string) => {
    const component = () => require(`./pages/${name}`).default
    try {
        return React.createElement(component());
    } catch (error: any) {
        // If can't find module 
        return <NotFound />
    }
}

const PageRender = () => {
    const { page, slug } = useParams<Params>();
    let name = "";

    if (page) {
        name = slug ? `${page}/[slug]` : `${page}`
    }

    return generatePage(name);
}

export default PageRender
