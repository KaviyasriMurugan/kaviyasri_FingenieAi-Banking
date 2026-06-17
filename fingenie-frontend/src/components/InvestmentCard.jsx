import React from 'react';
 
const InvestmentCard = ({ investment }) => {
    return (
        <div style={styles.card}>
            <div style={styles.left}>
                <strong>{investment.fundName}</strong>
                <span style={styles.category}>
                    {investment.category}
                </span>
            </div>
            <div style={styles.right}>
                <span style={styles.amount}>
                    Rs.{Number(investment.investedAmount)
                        .toLocaleString()}
                </span>
                <span style={{
                    ...styles.risk,
                    background: investment.riskLevel === 'LOW'
                        ? '#e0ffe0' : investment.riskLevel === 'MEDIUM'
                        ? '#fff3e0' : '#ffe0e0',
                    color: investment.riskLevel === 'LOW'
                        ? '#060' : investment.riskLevel === 'MEDIUM'
                        ? '#c60' : '#c00',
                }}>
                    {investment.riskLevel}
                </span>
            </div>
        </div>
    );
};
 
const styles = {
    card: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '16px',
        background: '#f9f9f9', borderRadius: '12px',
        marginBottom: '12px',
    },
    left: {
        display: 'flex', flexDirection: 'column', gap: '4px',
    },
    category: { fontSize: '12px', color: '#666' },
    right: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: '4px',
    },
    amount: { fontWeight: '700', color: '#333' },
    risk: {
        padding: '4px 12px', borderRadius: '12px',
        fontSize: '12px', fontWeight: '600',
    },
};
 
export default InvestmentCard;
 