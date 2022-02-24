import React from 'react';
import MemeGallery, {PageType} from './MemeGallery';

/*
* Top Ranked Page, showing a list of the most popular memes in the database (by number of likes)
*/
export default class TopRanked extends React.Component{
    render() {
        return (
            <div className="content" key={Date.now()}>
                <h4>Top Ranked Memes</h4>
                <MemeGallery pageType={PageType.TOP_MEMES}></MemeGallery>
            </div>
        );
    }
}