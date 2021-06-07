import React from 'react';
import { useGetGoods } from '../../../hooks/useGoods';
import { useGetStreamKey } from '../../../hooks/useKey';

export const GoodsBody: React.FC = () => {
    const { data: getStreamData } = useGetStreamKey();
    const { data: goodsData } = useGetGoods(getStreamData?.getStreamKey?.id);

    console.log(goodsData);

    return (
        <div>
            <h4 className={'blind'}>{'소개상품'}</h4>
            <div className={'box-border overflow-y-auto'} style={{ height: '400px' }}>
                <ul className={'relative goods_list_ul h-full'}>
                    {goodsData?.getGoodsList?.goodsList?.map((item: any, index: number) => {
                        if (!item) {
                            return (
                                <div
                                    className={'flex h-full justify-center items-center font-medium'}
                                    style={{ paddingBottom: '20px', color: '#929294' }}
                                >
                                    등록된 상품이 없습니다.
                                </div>
                            );
                        }
                        return (
                            <li key={index} className={'goods_list_li'}>
                                <a
                                    href={`/goods/${item.goodsId.id}`}
                                    key={item.goodsId.id}
                                    className={'block relative'}
                                    style={{ paddingLeft: '88px' }}
                                >
                                    <div className={'thumbnail'}>
                                        <img
                                            className={'rounded-lg'}
                                            src={`https://active.thesaracen.com/img/template/goods/${item.goodsId.id}/${item.goodsId.thumbnail}`}
                                        />
                                    </div>
                                    <div className={'goods_info'}>
                                        <span className={'goods_info_name'}>{item.goodsTitle}</span>
                                        <span className={'goods_info_price'}>{item.goodsId.template[0].prices[0].market_price}</span>
                                        <span className={'goods_info_sale_price'}>{item.goodsId.template[0].prices[0].sale_price}</span>
                                        <span className={'goods_info_brandname'}>{item.goodsId.template[0].brand.name}</span>
                                    </div>
                                </a>
                                <button>
                                    <i></i>
                                    <span className={'blind'}>소개상품</span>
                                </button>
                            </li>
                        );
                    })}{' '}
                </ul>
            </div>
        </div>
    );
};
