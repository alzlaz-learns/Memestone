import React from 'react';
import MemeGallery, {PageType} from './MemeGallery';

export default class TopRanked extends React.Component{
    render() {
        return (
            <div className="content">
                <h4>Home</h4>
                <MemeGallery pageType={PageType.HOME}></MemeGallery>
            </div>
        );
    }
}