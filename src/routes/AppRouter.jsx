import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Homepage from '../components/HomePage';
import CreateArticle from '../components/CreateArticle';
import PageHeader from '../components/PageHeader';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div>
                <PageHeader />
                <Route exact path="/" component={Homepage} />
                <Route path="/articles/create" component={CreateArticle} />
            </div>
        </BrowserRouter>
    )
};

export default AppRouter;