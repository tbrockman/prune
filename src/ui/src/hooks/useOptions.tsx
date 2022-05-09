import { useEffect, useState } from "react";
import { getOptionsAsync, Options, setOptionAsync } from "../util";

export default function useOptions(): [Options | undefined, Function] {

    const [options, setOptions] = useState<Options>()
    console.log('got options', options)

    const setOptionProxy = async (key: string, value: any) => {
        setOptions((prevState: any) => ({
            ...prevState,
            [key]: value
        }));
        await setOptionAsync(key, value)
    }

    useEffect(() => {
        console.log('loading???')
        const init = async () => {
            const asyncOptions = await getOptionsAsync()
            console.log('found asyncOptions', asyncOptions)
            setOptions(asyncOptions)
        }
        init()
    }, [])

    return [options, setOptionProxy]
}