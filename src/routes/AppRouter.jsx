import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Homepage from '../components/HomePage';
import PageHeader from '../components/PageHeader';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <div>
                <PageHeader />
                <Route exact path="/" component={Homepage} />
            </div>
        </BrowserRouter>
    )
};

export default AppRouter;
