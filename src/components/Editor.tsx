'use client'

import TextareaAutoSize from 'react-textarea-autosize'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSubmissionType, postValidator } from '@/lib/validators/post'
import { useCallback, useEffect, useRef, useState } from 'react'
import type EditorJS from '@editorjs/editorjs'
import { uploadFiles } from '@/lib/uploadthing'

export const Editor = ({ subredditId }: { subredditId: string }) => {

    const { register, handleSubmit, formState: { errors } } = useForm<postSubmissionType>({
        resolver: zodResolver(postValidator),
        defaultValues: {
            title: '',
            subredditId,
            content: null
        }
    })

    const ref = useRef<EditorJS>()
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(()=> {
        if(typeof window !== 'undefined') {
            setIsMounted(true)
        }
    }, [])

    const initializeEditor = useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default
        const Header = (await import('@editorjs/header')).default
        const Embed = (await import('@editorjs/embed')).default
        const Table = (await import('@editorjs/table')).default
        const List = (await import('@editorjs/list')).default
        const Code = (await import('@editorjs/code')).default
        const LinkTool = (await import('@editorjs/link')).default
        const InlineCode = (await import('@editorjs/inline-code')).default
        const ImageTool = (await import('@editorjs/image')).default

        if (!ref.current) {
            const editor = new EditorJS({   
                holder: 'editorjs',
                onReady() {
                    ref.current = editor
                },
                placeholder: 'Type here to write your post...',
                inlineToolbar: true,
                data: { blocks: [] },
                tools: {
                    header: Header,
                    linkTool: {
                        class: LinkTool,
                        config: {
                            endpoint: '/api/link'
                        }
                    },
                    image: {
                        class: ImageTool,
                        config: {
                            uploader: {
                                async uploadByFile(file: File) {
                                    // const [res] = await uploadFiles([file], "imageUploader")

                                    return {
                                        success: 1,
                                        // file: {
                                        //     url: res.fileUrl
                                        // }
                                    }
                                }
                            }
                        }
                    },
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed 
                }
            })
        }
    }, [])

    console.log(isMounted)
    useEffect(()=> {
        const init = async ()=> {
            await initializeEditor()

            setTimeout(()=> {

            })
            if(isMounted) {
                init()
                return ()=> {}
            }
        } 
    }, [isMounted, initializeEditor])


    return (
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <form id="subreddit-post-form" className="w-fit" onSubmit={() => { }}>
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutoSize placeholder='Title' className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none' />
                    <div id='editorjs' className='min-h-[500px]'/>
                </div>
            </form>
        </div>
    )
}