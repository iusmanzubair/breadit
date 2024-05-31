'use client'

import TextareaAutoSize from 'react-textarea-autosize'

export const Editor = ()=> {
    return(
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <form id="subreddit-post-form" className="w-fit" onSubmit={()=> {}}>
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutoSize placeholder='Title' className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none'/>
                </div>
            </form>
        </div>
    )
}