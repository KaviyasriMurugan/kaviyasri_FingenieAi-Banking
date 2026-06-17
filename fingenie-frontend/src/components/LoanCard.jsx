import React from 'react';
 
const LoanCard = ({ loan }) => {
    const getStatusColor = (status) => {
        if (status === 'APPROVED') return { bg: '#e0ffe0', color: '#060' };
        if (status === 'REJECTED') return { bg: '#ffe0e0', color: '#c00' };
        return { bg: '#fff3e0', color: '#c60' };
    };
 
    const statusStyle = getStatusColor(loan.status);
 
    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <div>
                    <strong style={styles.amount}>
                        Rs.{Number(loan.loanAmount).toLocaleString()}
                    </strong>
                    <p style={styles.type}>
                        {loan.employmentType} | {loan.tenureMonths} months
                    </p>
                </div>
                <span style={{
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '14px',
                }}>
                    {loan.status}
                </span>
            </div>
 
            <div style={styles.details}>
                <div style={styles.detailItem}>
                    <p style={styles.detailKey}>Credit Score</p>
                    <p style={{
                        ...styles.detailVal,
                        color: loan.creditScore >= 750 ? '#060' :
                            loan.creditScore >= 650 ? '#c60' : '#c00'
                    }}>
                        {loan.creditScore}
                    </p>
                </div>
                <div style={styles.detailItem}>
                    <p style={styles.detailKey}>Annual Income</p>
                    <p style={styles.detailVal}>
                        Rs.{Number(loan.annualIncome).toLocaleString()}
                    </p>
                </div>
                <div style={styles.detailItem}>
                    <p style={styles.detailKey}>Approval Score</p>
                    <p style={{
                        ...styles.detailVal,
                        color: loan.approvalProbability >= 0.6
                            ? '#060' : '#c00'
                    }}>
                        {(loan.approvalProbability * 100).toFixed(0)}%
                    </p>
                </div>
                <div style={styles.detailItem}>
                    <p style={styles.detailKey}>Tenure</p>
                    <p style={styles.detailVal}>
                        {loan.tenureMonths} months
                    </p>
                </div>
            </div>
 
            <div style={styles.progressBarBg}>
                <div style={{
                    width: `${(loan.approvalProbability * 100).toFixed(0)}%`,
                    height: '8px',
                    background: loan.approvalProbability >= 0.6
                        ? '#2ed573' : '#ff4757',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                }} />
            </div>
            <p style={styles.probText}>
                Approval Probability: {(loan.approvalProbability * 100).toFixed(0)}%
            </p>
 
            {loan.status === 'REJECTED' && (
                <div style={styles.rejectedMsg}>
                    Loan Rejected - Improve credit score above 700!
                </div>
            )}
 
            {loan.status === 'APPROVED' && (
                <div style={styles.approvedMsg}>
                    Loan Approved! Our team will contact you shortly.
                </div>
            )}
        </div>
    );
};
 
const styles = {
    card: {
        background: '#f9f9f9',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid #e0e0e0',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    amount: {
        fontSize: '20px',
        color: '#333',
        fontWeight: '700',
    },
    type: {
        margin: '4px 0 0',
        color: '#666',
        fontSize: '13px',
    },
    details: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '12px',
    },
    detailItem: {
        background: 'white',
        padding: '10px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    detailKey: {
        margin: 0,
        color: '#666',
        fontSize: '11px',
        fontWeight: '600',
    },
    detailVal: {
        margin: '4px 0 0',
        fontWeight: '700',
        fontSize: '14px',
        color: '#333',
    },
    progressBarBg: {
        background: '#e0e0e0',
        borderRadius: '4px',
        height: '8px',
        marginBottom: '4px',
    },
    probText: {
        margin: '4px 0 8px',
        fontSize: '12px',
        color: '#666',
    },
    rejectedMsg: {
        background: '#ffe0e0',
        color: '#c00',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginTop: '8px',
    },
    approvedMsg: {
        background: '#e0ffe0',
        color: '#060',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '13px',
        marginTop: '8px',
    },
};
 
export default LoanCard;
 