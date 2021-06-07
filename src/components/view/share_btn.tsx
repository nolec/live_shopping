import React from 'react';
import { useReactiveVar } from '@apollo/client';
import { isFullOnInVar } from '../../apollo';

export const ShareBtn = () => {
    const isFullOn = useReactiveVar(isFullOnInVar);
    return (
        <button className={`live_share_btn ${isFullOn ? 'invisible' : 'visible'}`}>
            <svg
                className={'live_icon_share_off'}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width="80"
                height="80"
                viewBox="0 0 80 80"
            >
                <g id="sharing">
                    <image
                        id="벡터_고급_개체"
                        data-name="벡터 고급 개체"
                        x="2"
                        y="3"
                        width="82"
                        height="81"
                        xlinkHref="data:img/png;base64,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"
                    />
                </g>
            </svg>

            <span className="blind">공유하기</span>
        </button>
    );
};