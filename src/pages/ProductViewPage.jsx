import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { lista } from '../components/ProductListing';
import Slider from "react-slick";
import '../css/spacing.css';
import Section from '../components/Section';
import arrowLeft from '../assets/arrow-left.svg';
import arrowRight from '../assets/arrow-right.svg';
import { useState } from 'react';

const link = {src: "/produtos", text: "Ver Todos"};

function NextPic ({ onClick }) {
        return(
            <div className="absolute top-1/2 right-2 cursor-pointer z-10" onClick={onClick} style={{ transform: 'translateY(-50%)' }}>
                <img src={arrowRight} alt="Next" className='w-8 h-8' />
            </div>
        )
    };

function PrevPic ({ onClick }){
    return (
        <div className="absolute top-1/2 left-2 cursor-pointer z-10" onClick={onClick} style={{ transform: 'translateY(-50%)' }}>
            <img src={arrowLeft} alt="Previous" className='w-8 h-8' />
        </div>
    )
};

export default function ProductViewPage({ onAddToCart }) {
    
    const { id } = useParams();

    const product = lista.find(prod => prod.id == id);

    const related = lista
        .filter(cat => cat.category == product.category)
        .filter(prod => prod.id !== product.id);
    
    const [selectColor, setSelectColor] = useState(product.color[0]);
    const [selectSize, setSelectSize] = useState (null);

    const discountPrice = (product.price - (product.discount * product.price / 100)).toFixed(2);

    const imageCarousel = product.color.map((color, index) => (
        <div key={index} className='2xl:h-[700px] lg:h-[550px] md:h-[480px] h-[300px]'>
            <img src={product.image} alt= {product.name} style={{backgroundColor: color}} className='h-full w-full object-scale-down'/>
        </div>
    ));

    const settings = {
        dots: true,
        dotsClass: "slick-dots slick-thumb flex gap-2 justify-center mt-4",
        infinite: product.color.length > 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: function(i) {
            return(
                <a className="rounded overflow-hidden" style={{backgroundColor: product.color[i]}}>
                    <img src={product.image} alt={product.name} className="object-cover rounded border-2 border-transparent transition-all duration-200"/>
                </a>
            )
        },
        nextArrow: <NextPic/>,
        prevArrow: <PrevPic/>
    }

    return (
        <div className='bg-gray-50 text-gray-900'>
            <main className='spacing-px-md spacing-my-lg'>
                <div className='flex flex-col md:flex-row gap-8 spacing-my-md'>
                    <div className='flex-1 w-full md:w-1/2'>
                        <Slider {...settings}>
                            {imageCarousel}
                        </Slider>
                    </div>

                    {/* Detalhes do produto */}
                    <div className='flex-1'>
                        <h1 className='text-2xl font-bold leading-snug'>
                            {product.name}
                        </h1>
                        <p className='text-sm text-gray-500 spacing-mt-sm'>{product.brand} | Cód: {product.code}</p>
                        <div className='flex items-center gap-2 spacing-mt-md spacing-mb-md'>
                            <div className='bg-(--warning) rounded text-sm text-(--white) font-medium spacing-px-sm'>
                                {product.rating} &#9733;
                            </div>
                            <span className='text-gray-500 text-sm'>({product.reviews} avaliações)</span>
                        </div>

                        <div className='flex gap-5 spacing-mb-md'>
                            {product.discount && <p className="text-[24px] text-(--darkgray)">R$ {discountPrice}</p>}
                            <p className={`${product.discount ? 'text-(--lightgray) line-through text-[13px] self-end productDiscount' : 'text-(--darkgray) text-[24px] '}`}>R$ {product.price.toFixed(2)}</p>
                        </div>
                        <p className='text-sm text-(--darkgray) spacing-mb-sm'>Descrição do produto</p>
                        <p className='text-sm text-gray-700 spacing-mb-md'>{product.description}</p>

                        {/* Tamanhos */}
                        <div className='spacing-mt-md'>
                            <label className='block text-sm font-medium spacing-mb-sm'>Tamanho</label>
                            <div className='flex gap-2'>
                                {product.size.map((size) => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectSize(size)}
                                        className={`border border-(--lightgray2) rounded text-sm w-12 h-12 ${selectSize === size ? 'bg-(--principal) text-(--white)': 'hover:bg-(--principal) hover:text-(--white)'}`}
                                    > {size} 
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cores */}
                        <div className='spacing-mt-md'>
                            <label className='block text-sm font-medium spacing-mb-sm'>Cor</label>
                            <div className='flex gap-2'>
                                {product.color.map((color) => (
                                    <span 
                                        key={color}
                                        onClick={() => setSelectColor(color)}
                                        style={{backgroundColor: color}} 
                                        className={`w-6 h-6 rounded-full border cursor-pointer ${selectColor === color ? 'border-[3px] border-(--darkgray)' : 'border-none'}`} 
                                    />
                                ))}
                            </div>
                        </div>

                        <button className='bg-[#FFB31F] hover:bg-[#ffad09] text-white font-medium rounded spacing-mt-lg w-50 h-12 cursor-pointer' onClick={() => onAddToCart?.(product, selectColor, selectSize)}>
                            COMPRAR
                        </button>
                    </div>
                </div>

                {/* Produtos Relacionados */}
                <Section title="Produtos Relacionados" link = {link} titleAlign= 'center' >
                    <ProductCard lista={related} />
                </Section>
            </main>
        </div>
    );
}