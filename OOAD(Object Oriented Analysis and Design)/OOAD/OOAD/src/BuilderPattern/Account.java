package BuilderPattern;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AccountBuilder {

    // Account Class
    static class Account {
        // 10 fields for the Account class
        private final String accountNumber;
        private final String accountType; // e.g., SAVING, CHECKING
        private final BigDecimal currentBalance;
        private final String currencyCode; // e.g., USD, KHR
        private final String accountStatus; // e.g., ACTIVE, CLOSED, FROZEN
        private final String associatedUserId;
        private final LocalDateTime openingDate;
        private final LocalDateTime lastActivityDate;
        private final boolean isJointAccount;
        private final BigDecimal dailyWithdrawalLimit;

        // Private constructor used by the Builder
        private Account(AccountBuilder builder) {
            this.accountNumber = builder.accountNumber;
            this.accountType = builder.accountType;
            this.currentBalance = builder.currentBalance;
            this.currencyCode = builder.currencyCode;
            this.accountStatus = builder.accountStatus;
            this.associatedUserId = builder.associatedUserId;
            this.openingDate = builder.openingDate;
            this.lastActivityDate = builder.lastActivityDate;
            this.isJointAccount = builder.isJointAccount;
            this.dailyWithdrawalLimit = builder.dailyWithdrawalLimit;
        }

        @Override
        public String toString() {
            return "Account{" +
                    "accountNumber='" + accountNumber + '\'' +
                    ", type='" + accountType + '\'' +
                    ", balance=" + currentBalance.toPlainString() + " " + currencyCode +
                    ", status='" + accountStatus + '\'' +
                    ", userId='" + associatedUserId + '\'' +
                    '}';
        }

        // Static nested Builder class
        public static class AccountBuilder {
            String accountNumber;
            String accountType;
            BigDecimal currentBalance = BigDecimal.ZERO; // Default value
            String currencyCode = "USD"; // Default value
            String accountStatus = "ACTIVE"; // Default value
            String associatedUserId;
            LocalDateTime openingDate;
            LocalDateTime lastActivityDate;
            private boolean isJointAccount = false; // Default value
            private BigDecimal dailyWithdrawalLimit = new BigDecimal("1000.00"); // Default value

            // Builder methods that return the builder instance (fluent interface)
            public AccountBuilder setAccountNumber(String accountNumber) {
                this.accountNumber = accountNumber;
                return this;
            }

            public AccountBuilder setAccountType(String accountType) {
                this.accountType = accountType;
                return this;
            }

            public AccountBuilder setCurrentBalance(BigDecimal currentBalance) {
                this.currentBalance = currentBalance;
                return this;
            }

            public AccountBuilder setCurrencyCode(String currencyCode) {
                this.currencyCode = currencyCode;
                return this;
            }

            public AccountBuilder setAccountStatus(String accountStatus) {
                this.accountStatus = accountStatus;
                return this;
            }

            public AccountBuilder setAssociatedUserId(String associatedUserId) {
                this.associatedUserId = associatedUserId;
                return this;
            }

            public AccountBuilder setOpeningDate(LocalDateTime openingDate) {
                this.openingDate = openingDate;
                return this;
            }

            public AccountBuilder setLastActivityDate(LocalDateTime lastActivityDate) {
                this.lastActivityDate = lastActivityDate;
                return this;
            }

            public AccountBuilder setIsJointAccount(boolean isJointAccount) {
                this.isJointAccount = isJointAccount;
                return this;
            }

            public AccountBuilder setDailyWithdrawalLimit(BigDecimal dailyWithdrawalLimit) {
                this.dailyWithdrawalLimit = dailyWithdrawalLimit;
                return this;
            }

            // Build method to create the final Account object
            public Account build() {
                // Basic validation can occur here
                if (accountNumber == null || associatedUserId == null || accountType == null) {
                    throw new IllegalStateException("Required fields missing for Account creation.");
                }
                if (openingDate == null) {
                    this.openingDate = LocalDateTime.now(); // Set a default opening date if missing
                }
                return new Account(this);
            }

        }
    }
}
