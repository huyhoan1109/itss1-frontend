import { Button, Form, Divider, Select, Col, Row, InputNumber, Rate } from 'antd'
import { useTranslation } from 'react-i18next'
import { MdOutlineAttachMoney, MdOutlinePersonPinCircle } from 'react-icons/md'
import {ImFilter} from 'react-icons/im'
import { useState } from 'react'
import styled from 'styled-components'

const ColRight = () => {
    const [lowAge, setLowAge] = useState('');
    const [highAge, setHighAge] = useState('');
    const [lowPrice, setLowPrice] = useState('');
    const [highPrice, setHighPrice] = useState('');
    const [gender, setGender] = useState('');
    const [experience, setExperience] = useState('');
    const [teachMethod, setTeachMethod] = useState('');
    const [stars, setStars] = useState('');
    const [level, setLevel] = useState('');

    const {t} = useTranslation()

    const handleSubmit = () => {
        let f = {
            low_age: lowAge,
            high_age: highAge,
            low_price: lowPrice,
            high_price: highPrice,
            gender: gender,
            experience: experience,
            teach_method: teachMethod,
            star_average: stars,
            level: level
        }
    }

    return (
        <Wrapper2>
            <Form className='form'>
                <Divider><ImFilter /></Divider>
                <Form.Item label={t('content.level')} style={{ maxWidth: 200 }}>
                    <Select
                        defaultValue={'0'}
                        options={
                            Array(8)
                                .fill(0)
                                .map((item, index) => {
                                    const age = index + 0
                                    return {
                                        value: age.toString(),
                                        label: age.toString(),
                                    }
                                }
                            )
                        }
                        onSelect={(value) => {
                            setLevel(value)
                        }}
                    />
                </Form.Item>
                <Form.Item label={t('content.experience')} style={{ maxWidth: 200 }}>
                    <Select
                        defaultValue={'0'}
                        options={
                            Array(10)
                                .fill(0)
                                .map((item, index) => {
                                    const age = index + 0
                                    return {
                                        value: age.toString(),
                                        label: age.toString()+' '+t('content.year'),
                                    }
                                }
                            )
                        }
                        onSelect={(value) => {setExperience(value)}}
                    />
                </Form.Item>
                <Form.Item label={t('content.price')} >
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col span={10}>
                    <Form.Item label={t('content.from')} colon>
                        <InputNumber 
                            min={0}
                            style={{ width: '120%' }} 
                            prefix={<MdOutlineAttachMoney className='site-form-item-icon' />}
                            onChange={(value) => {
                                if (value != null){
                                    setLowPrice(value.toString())
                                }
                            }}
                        />
                    </Form.Item>
                    </Col>
                    <Col span={10}>
                    <Form.Item label={t('content.to')} colon >
                        <InputNumber 
                            min={0}
                            style={{ width: '120%' }} 
                            prefix={<MdOutlineAttachMoney className='site-form-item-icon' />} 
                            onChange={(value) => {
                                if (value != null){
                                    setHighPrice(value.toString())
                                }
                            }}
                        />
                    </Form.Item>
                    </Col>
                </Row>
                <Form.Item label={t('content.age')} >
                </Form.Item>
                <Row gutter={[16, 16]}>
                    <Col span={10}>
                        <Form.Item label={t('content.from')} colon >
                            <InputNumber 
                                min={15}
                                max={80}
                                style={{ width: '120%' }} 
                                prefix={<MdOutlinePersonPinCircle className='site-form-item-icon' />}
                                onChange={(value) => {
                                    if (value != null){
                                        setLowAge(value.toString())
                                        if(value > Number(highAge) || highAge == '') setHighAge(value.toString())
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label={t('content.to')} colon >
                            <InputNumber 
                                min={15}
                                max={80}
                                style={{ width: '120%' }} 
                                prefix={<MdOutlinePersonPinCircle className='site-form-item-icon' />}
                                onChange={(value) => {
                                    if (value != null){
                                        setHighAge(value.toString())
                                        if(value < Number(lowAge) || lowAge == '') setLowAge(value.toString())
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label={t('content.rating')} >
                    <Rate 
                        onChange={(value) => {
                            setStars(value.toString())
                        }
                    }/>
                </Form.Item>
                <Form.Item label={t('content.gender')} style={{ maxWidth: 200 }}>
                    <Select
                        options={[
                        {
                            value: 'male',
                            label: t('content.male'),
                        },
                        {
                            value: 'female',
                            label: t('content.female'),
                        },
                        {
                            value: '',
                            label: t('content.null'),
                        },
                        ]}
                        onSelect={(value) => {
                            setGender(value)
                        }}
                    />
                </Form.Item>
                <Form.Item label={t('content.teach_method')} style={{ maxWidth: 300 }}>
                    <Select
                        options={
                            ["online", "offline1", "offline2"]
                            .map((item, index) => {
                                return {
                                    value: item,
                                    label: t(`content.${item}`),
                                }
                            })}
                        onSelect={(value) => {
                            setTeachMethod(value)
                        }}
                    />
                </Form.Item>
                <Button type='primary' onClick={handleSubmit}>{t('content.filter')}</Button>
            </Form>
        </Wrapper2>
    )
}

const Wrapper2 = styled.div`
    .form {
        display: flex;
        flex-direction: column;
        // margin-top: 25%;
    }

    .ant-form-item {
        margin-left: 20px
    }

    .ant-form-item-label {
        text-align: start;
    }

    .ant-form-item-label>label {
        font-size: 15px;
    }

`

export default ColRight
