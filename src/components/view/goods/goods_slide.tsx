import React from 'react';
import { isGoodsModalOnInVar } from '../../../apollo';
import { useGetGoods } from '../../../hooks/useGoods';
import { useGetStreamKey } from '../../../hooks/useKey';
import Slick from 'react-slick';

export const GoodsSlide = () => {
    const { data: getStreamData } = useGetStreamKey();
    const { data: goodsData } = useGetGoods(getStreamData?.getStreamKey?.id);
    console.log(goodsData);
    const openGoods = (e: any) => {
        e.stopPropagation();
        isGoodsModalOnInVar(true);
    };
    return (
        <div className={'live_basket_box z-50'} onClick={openGoods}>
            <div className={'live_basket_inner'}>
                <Slick
                    infinite={true}
                    initialSlide={0}
                    arrows={false}
                    slidesToShow={1}
                    slidesToScroll={1}
                    vertical={true}
                    verticalSwiping={false}
                    autoplay={true}
                    autoplaySpeed={5000}
                >
                    {goodsData?.getGoodsList?.goodsList?.map((item: any, index: number) => {
                        return (
                            <div key={index}>
                                <img
                                    className={'rounded-lg'}
                                    src={`https://active.thesaracen.com/img/template/goods/${item.goodsId.id}/${item.goodsId.thumbnail}`}
                                />
                            </div>
                        );
                    })}
                </Slick>
            </div>
        </div>
    );
};
