import React from 'react';
 
const TransactionCard = ({ transaction }) => {
    return (
        <div style={styles.card}>
            <div style={styles.left}>
                <span style={styles.type}>
                    {transaction.type}
                </span>
                <span style={styles.desc}>
                    {transaction.description}
                </span>
                <span style={styles.category}>
                    {transaction.category}
                </span>
            </div>
            <div style={styles.right}>
                <span style={{
                    ...styles.amount,
                    color: transaction.type === 'DEPOSIT'
                        ? '#2ed573' : '#ff4757'
                }}>
                    {transaction.type === 'DEPOSIT' ? '+' : '-'}
                    Rs.{transaction.amount}
                </span>
                <span style={{
                    ...styles.risk,
                    background: transaction.riskScore > 0.7
                        ? '#ffe0e0' : '#e0ffe0',
                    color: transaction.riskScore > 0.7
                        ? '#c00' : '#060',
                }}>
                    Risk: {transaction.riskScore}
                </span>
            </div>
        </div>
    );
};
 
const styles = {
    card: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    left: {
        display: 'flex', flexDirection: 'column', gap: '4px',
    },
    type: { fontWeight: '600', color: '#333' },
    desc: { fontSize: '12px', color: '#666' },
    category: {
        fontSize: '11px', color: '#667eea',
        fontWeight: '600',
    },
    right: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: '4px',
    },
    amount: { fontWeight: '700', fontSize: '16px' },
    risk: {
        padding: '2px 8px', borderRadius: '12px',
        fontSize: '11px', fontWeight: '600',
    },
};
 
export default TransactionCard;
 