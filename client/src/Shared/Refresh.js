import React from 'react';

export const Refresh = ({value, onRefresh, children}) => {
    if(value) return (
    <div>
        {children}
    </div>
    ); else {
        onRefresh()
        return null
    }
}