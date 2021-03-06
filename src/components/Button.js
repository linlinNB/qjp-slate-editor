import React, { useState } from 'react';
import { cx, css } from 'emotion';
import { useSlate } from 'slate-react';
import { isMarkActive, isBlockActive, MyEditor } from '../helpers';

export const Button = React.forwardRef(
    ({ className, active, reversed, ...props }, ref) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
                    cursor: pointer;
                    color: ${reversed
                        ? active
                            ? 'white'
                            : '#aaa'
                        : active
                            ? 'black'
                            : '#ccc'};
                `
            )}
        />
    )
);

export const BlockButton = ({ format, icon, ...props }) => {
    const editor = useSlate()
    return (
        <Button
            {...props}
            active={isBlockActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                if (format === 'table-cell-merge') {
                    MyEditor.mergeTableCells(editor);
                    return
                }
                if (format === 'table-cell-split') {
                    MyEditor.splitTableCells(editor);
                    return
                }
                if (format === 'table-row-insert-up') {
                    MyEditor.insertUpTableRow(editor);
                    return   
                }
                if (format === 'table-row-insert-down') {
                    MyEditor.insertDownTableRow(editor);
                    return
                }
                if (format === 'table-col-insert-left') {
                    MyEditor.insertLeftTableCol(editor);
                    return
                }
                if (format === 'table-col-insert-right') {
                    MyEditor.insertRightTableCol(editor);
                    return
                }
                if (format === 'table-row-delete') {
                    MyEditor.deleteTableRow(editor);
                    return
                }
                if (format === 'table-col-delete') {
                    MyEditor.deleteTableCol(editor);
                    return
                }
                if (format === 'checkbox') {
                    MyEditor.insertCheckbox(editor);
                    return
                }
                if (format === 'radio') {
                    MyEditor.insertRadio(editor);
                    return
                }
                MyEditor.toggleBlock(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

export const MarkButton = ({ format, icon, ...props }) => {
    const editor = useSlate()
    return (
        <Button
            {...props}
            active={isMarkActive(editor, format)}
            onMouseDown={(event) => {
                event.preventDefault()
                MyEditor.toggleMark(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

export const CreateTableButton = ({ icon, ...props }) => {
    const [xy, setXy] = useState(null);
    const [visible, setVisible] = useState(false);
    const editor = useSlate()
    const active = isBlockActive(editor, 'table');
    const gridsRow = 14, gridsCol = 14;
    const gridWidth = 20, gridHeight = 20;
    const grids = new Array(gridsRow).fill(new Array(gridsCol).fill(null)).map((item, index) => item.map((_, ind) => [index, ind]));

    const onTdMouseMove = (e, xy) => {
        e.preventDefault();
        setXy(xy);
    }

    const onTdMouseDown = (e, xy) => {
        e.preventDefault();
        if (!active) {
            e.stopPropagation();
            MyEditor.insertTable(editor, xy[0] + 1, xy[1] + 1);
            setVisible(false);
        }
    }
    
    const onModalMouseLeave = e => {
        e.preventDefault;
        setVisible(false);
        setXy(null);
    }

    const onButtonMousDown = e => {
        e.preventDefault()
        if (!active) {
            setVisible(true)
        }
    }

    return (
        <Button
            {...props}
            active={active}
            style={{ position: 'relative' }}
            disabled={active}
            onMouseDown={onButtonMousDown}
        >
            {icon}
            <div
                className={css`
                    position: absolute;
                    top: 100%;
                    left: 0;
                    box-sizing: border-box;
                    width: ${gridWidth * gridsCol + 5}px;
                    padding: 4px;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                `}
                style={{ display: visible ? 'block' : 'none' }}
                onMouseLeave={onModalMouseLeave}
            >
                <table
                    className={css`
                        border: 1px solid #ccc;
                        border-collapse: collapse;
                        border-spacing: 0;
                        & tr,& td {
                            border: 1px solid #ccc;
                            margin: 0;
                            padding: 0;
                            width: ${gridWidth}px;
                            height: ${gridHeight}px;
                            box-sizing: border-box;
                        }
                        & td.active {
                            background: #eee;
                        }
                    `}
                >
                    <tbody>
                        {
                            grids.map(item => (
                                <tr key={item[0][0]}>
                                    {item.map(it => (
                                        <td
                                            key={`${it[0]}${it[1]}`}
                                            title={`${it[0]+1}x${it[1]+1}`}
                                            className={xy && it[0] <= xy[0] && it[1] <= xy[1] ? 'active' : ''}
                                            onMouseMove={e => onTdMouseMove(e, it)}
                                            onMouseDown={e => onTdMouseDown(e, it)}
                                        />
                                    ))}
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </Button>
    )
}