//! # DotPOAP - Polkadot Proof of Attendance Protocol
//!
//! A decentralized POAP system built on Polkadot using ink! smart contracts.
//! Enables event organizers to issue verifiable digital badges (NFTs) to participants
//! of events and initiatives across the Polkadot ecosystem.
//!
//! ## Features
//!
//! - Event creation and management by organizers
//! - NFT-based attendance badges with unique metadata
//! - Badge claiming with verification mechanisms
//! - Transfer and ownership tracking
//! - Event and badge querying for frontend integration
//!
//! ## Warning
//!
//! This contract is for demonstration purposes. It should be audited before
//! production use.

#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod dotpoap {
    use ink::{
        storage::Mapping,
        prelude::{string::String, vec::Vec},
    };

    use ink::primitives::H160;

    /// A unique identifier for events
    pub type EventId = u32;
    /// A unique identifier for badges (NFTs)
    pub type BadgeId = u32;

    /// Event information structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Event {
        /// Unique event identifier
        pub id: EventId,
        /// Event organizer account
        pub organizer: H160,
        /// Event name/title
        pub name: String,
        /// Event description
        pub description: String,
        /// Event location
        pub location: String,
        /// Event date (timestamp)
        pub date: u64,
        /// IPFS hash for additional metadata
        pub metadata_uri: String,
        /// Maximum number of badges that can be minted for this event
        pub max_badges: u32,
        /// Number of badges already minted
        pub minted_badges: u32,
        /// Whether the event is active for badge claiming
        pub is_active: bool,
        /// Whether claiming requires verification (for future merkle proof integration)
        pub requires_verification: bool,
    }

    /// Badge (NFT) information structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct Badge {
        /// Unique badge identifier
        pub id: BadgeId,
        /// Associated event ID
        pub event_id: EventId,
        /// Badge owner
        pub owner: H160,
        /// Badge metadata URI (IPFS)
        pub metadata_uri: String,
        /// Timestamp when badge was minted
        pub minted_at: u64,
        /// Badge serial number within the event
        pub serial_number: u32,
    }

    #[ink(storage)]
    pub struct DotPoap {
        /// Contract owner/admin
        owner: H160,
        /// Next event ID to be assigned
        next_event_id: EventId,
        /// Next badge ID to be assigned
        next_badge_id: BadgeId,
        /// Mapping from event ID to event data
        events: Mapping<EventId, Event>,
        /// Mapping from badge ID to badge data
        badges: Mapping<BadgeId, Badge>,
        /// Mapping from account to list of owned badge IDs
        owned_badges: Mapping<H160, Vec<BadgeId>>,
        /// Mapping from event ID to list of badge IDs minted for that event
        event_badges: Mapping<EventId, Vec<BadgeId>>,
        /// Mapping from (event_id, account) to badge_id for checking if user already has badge
        user_event_badges: Mapping<(EventId, H160), BadgeId>,
        /// Mapping from badge ID to approved account for transfer
        badge_approvals: Mapping<BadgeId, H160>,
        /// Mapping from (owner, operator) to approval for all badges
        operator_approvals: Mapping<(H160, H160), ()>,
    }

    /// Contract errors
    #[derive(Debug, PartialEq, Eq, Copy, Clone)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        /// Caller is not authorized for this operation
        NotAuthorized,
        /// Event does not exist
        EventNotFound,
        /// Badge does not exist
        BadgeNotFound,
        /// Event is not active for badge claiming
        EventNotActive,
        /// Maximum badges for event already minted
        MaxBadgesReached,
        /// User already has a badge for this event
        AlreadyHasBadge,
        /// Badge transfer not approved
        TransferNotApproved,
        /// Invalid input parameters
        InvalidInput,
        /// Operation not allowed
        NotAllowed,
    }

    /// Events emitted by the contract

    /// Event created
    #[ink(event)]
    pub struct EventCreated {
        #[ink(topic)]
        event_id: EventId,
        #[ink(topic)]
        organizer: H160,
        name: String,
    }

    /// Badge minted
    #[ink(event)]
    pub struct BadgeMinted {
        #[ink(topic)]
        badge_id: BadgeId,
        #[ink(topic)]
        event_id: EventId,
        #[ink(topic)]
        owner: H160,
        serial_number: u32,
    }

    /// Badge transferred
    #[ink(event)]
    pub struct BadgeTransferred {
        #[ink(topic)]
        badge_id: BadgeId,
        #[ink(topic)]
        from: H160,
        #[ink(topic)]
        to: H160,
    }

    /// Badge approved for transfer
    #[ink(event)]
    pub struct BadgeApproval {
        #[ink(topic)]
        badge_id: BadgeId,
        #[ink(topic)]
        owner: H160,
        #[ink(topic)]
        approved: H160,
    }

    /// Operator approval for all badges
    #[ink(event)]
    pub struct ApprovalForAll {
        #[ink(topic)]
        owner: H160,
        #[ink(topic)]
        operator: H160,
        approved: bool,
    }

    impl DotPoap {
        /// Creates a new DotPOAP contract instance
        #[ink(constructor)]
        pub fn new() -> Self {
            let caller = Self::env().caller();
            Self {
                owner: caller,
                next_event_id: 1,
                next_badge_id: 1,
                events: Mapping::default(),
                badges: Mapping::default(),
                owned_badges: Mapping::default(),
                event_badges: Mapping::default(),
                user_event_badges: Mapping::default(),
                badge_approvals: Mapping::default(),
                operator_approvals: Mapping::default(),
            }
        }

        /// Creates a default DotPOAP contract instance (for testing)
        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new()
        }

        /// Returns the contract owner
        #[ink(message)]
        pub fn owner(&self) -> H160 {
            self.owner
        }

        /// Returns the next event ID that will be assigned
        #[ink(message)]
        pub fn next_event_id(&self) -> EventId {
            self.next_event_id
        }

        /// Returns the next badge ID that will be assigned
        #[ink(message)]
        pub fn next_badge_id(&self) -> BadgeId {
            self.next_badge_id
        }

        // === EVENT ORGANIZER FUNCTIONS ===

        /// Creates a new event (only callable by any account - decentralized approach)
        #[ink(message)]
        pub fn create_event(
            &mut self,
            name: String,
            description: String,
            location: String,
            date: u64,
            metadata_uri: String,
            max_badges: u32,
            requires_verification: bool,
        ) -> Result<EventId, Error> {
            if name.is_empty() || max_badges == 0 {
                return Err(Error::InvalidInput);
            }

            let caller = self.env().caller();
            let event_id = self.next_event_id;

            let event = Event {
                id: event_id,
                organizer: caller,
                name: name.clone(),
                description,
                location,
                date,
                metadata_uri,
                max_badges,
                minted_badges: 0,
                is_active: true,
                requires_verification,
            };

            self.events.insert(event_id, &event);
            self.next_event_id += 1;

            // Initialize empty badge list for this event
            self.event_badges.insert(event_id, &Vec::<BadgeId>::new());

            self.env().emit_event(EventCreated {
                event_id,
                organizer: caller,
                name,
            });

            Ok(event_id)
        }

        /// Updates event details (only by organizer)
        #[ink(message)]
        pub fn update_event(
            &mut self,
            event_id: EventId,
            name: Option<String>,
            description: Option<String>,
            location: Option<String>,
            date: Option<u64>,
            metadata_uri: Option<String>,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            let mut event = self.events.get(event_id).ok_or(Error::EventNotFound)?;

            if event.organizer != caller {
                return Err(Error::NotAuthorized);
            }

            if let Some(new_name) = name {
                if new_name.is_empty() {
                    return Err(Error::InvalidInput);
                }
                event.name = new_name;
            }
            if let Some(new_description) = description {
                event.description = new_description;
            }
            if let Some(new_location) = location {
                event.location = new_location;
            }
            if let Some(new_date) = date {
                event.date = new_date;
            }
            if let Some(new_metadata_uri) = metadata_uri {
                event.metadata_uri = new_metadata_uri;
            }

            self.events.insert(event_id, &event);
            Ok(())
        }

        /// Activates or deactivates an event for badge claiming (only by organizer)
        #[ink(message)]
        pub fn set_event_active(&mut self, event_id: EventId, is_active: bool) -> Result<(), Error> {
            let caller = self.env().caller();
            let mut event = self.events.get(event_id).ok_or(Error::EventNotFound)?;

            if event.organizer != caller {
                return Err(Error::NotAuthorized);
            }

            event.is_active = is_active;
            self.events.insert(event_id, &event);
            Ok(())
        }

        /// Mints a badge for a specific user (only by event organizer)
        #[ink(message)]
        pub fn mint_badge_for_user(
            &mut self,
            event_id: EventId,
            recipient: H160,
            metadata_uri: String,
        ) -> Result<BadgeId, Error> {
            let caller = self.env().caller();
            let mut event = self.events.get(event_id).ok_or(Error::EventNotFound)?;

            if event.organizer != caller {
                return Err(Error::NotAuthorized);
            }

            if event.minted_badges >= event.max_badges {
                return Err(Error::MaxBadgesReached);
            }

            // Check if user already has a badge for this event
            if self.user_event_badges.contains((event_id, recipient)) {
                return Err(Error::AlreadyHasBadge);
            }

            let badge_id = self.next_badge_id;
            let serial_number = event.minted_badges + 1;

            let badge = Badge {
                id: badge_id,
                event_id,
                owner: recipient,
                metadata_uri,
                minted_at: self.env().block_timestamp(),
                serial_number,
            };

            // Update storage
            self.badges.insert(badge_id, &badge);
            self.next_badge_id += 1;
            event.minted_badges += 1;
            self.events.insert(event_id, &event);

            // Update user's badge list
            let mut user_badges = self.owned_badges.get(recipient).unwrap_or_default();
            user_badges.push(badge_id);
            self.owned_badges.insert(recipient, &user_badges);

            // Update event's badge list
            let mut event_badge_list = self.event_badges.get(event_id).unwrap_or_default();
            event_badge_list.push(badge_id);
            self.event_badges.insert(event_id, &event_badge_list);

            // Mark that user has badge for this event
            self.user_event_badges.insert((event_id, recipient), &badge_id);

            self.env().emit_event(BadgeMinted {
                badge_id,
                event_id,
                owner: recipient,
                serial_number,
            });

            Ok(badge_id)
        }

        // === COLLECTOR FUNCTIONS ===

        /// Claims a badge for the caller (self-service claiming)
        #[ink(message)]
        pub fn claim_badge(
            &mut self,
            event_id: EventId,
            metadata_uri: String,
        ) -> Result<BadgeId, Error> {
            let caller = self.env().caller();
            let mut event = self.events.get(event_id).ok_or(Error::EventNotFound)?;

            if !event.is_active {
                return Err(Error::EventNotActive);
            }

            if event.minted_badges >= event.max_badges {
                return Err(Error::MaxBadgesReached);
            }

            // Check if user already has a badge for this event
            if self.user_event_badges.contains((event_id, caller)) {
                return Err(Error::AlreadyHasBadge);
            }

            // Note: In a production system, you might want to add verification logic here
            // such as merkle proof verification, signature verification, etc.

            let badge_id = self.next_badge_id;
            let serial_number = event.minted_badges + 1;

            let badge = Badge {
                id: badge_id,
                event_id,
                owner: caller,
                metadata_uri,
                minted_at: self.env().block_timestamp(),
                serial_number,
            };

            // Update storage
            self.badges.insert(badge_id, &badge);
            self.next_badge_id += 1;
            event.minted_badges += 1;
            self.events.insert(event_id, &event);

            // Update user's badge list
            let mut user_badges = self.owned_badges.get(caller).unwrap_or_default();
            user_badges.push(badge_id);
            self.owned_badges.insert(caller, &user_badges);

            // Update event's badge list
            let mut event_badge_list = self.event_badges.get(event_id).unwrap_or_default();
            event_badge_list.push(badge_id);
            self.event_badges.insert(event_id, &event_badge_list);

            // Mark that user has badge for this event
            self.user_event_badges.insert((event_id, caller), &badge_id);

            self.env().emit_event(BadgeMinted {
                badge_id,
                event_id,
                owner: caller,
                serial_number,
            });

            Ok(badge_id)
        }

        /// Transfers a badge to another account
        #[ink(message)]
        pub fn transfer_badge(&mut self, badge_id: BadgeId, to: H160) -> Result<(), Error> {
            let caller = self.env().caller();
            let badge = self.badges.get(badge_id).ok_or(Error::BadgeNotFound)?;

            if badge.owner != caller {
                return Err(Error::NotAuthorized);
            }

            self._transfer_badge_from(caller, to, badge_id)
        }

        /// Transfers a badge from one account to another (requires approval)
        #[ink(message)]
        pub fn transfer_badge_from(
            &mut self,
            from: H160,
            to: H160,
            badge_id: BadgeId,
        ) -> Result<(), Error> {
            let caller = self.env().caller();
            let badge = self.badges.get(badge_id).ok_or(Error::BadgeNotFound)?;

            if badge.owner != from {
                return Err(Error::NotAuthorized);
            }

            // Check if caller is approved for this specific badge or is an operator
            let is_approved = self.badge_approvals.get(badge_id) == Some(caller)
                || self.operator_approvals.contains((from, caller))
                || caller == from;

            if !is_approved {
                return Err(Error::TransferNotApproved);
            }

            self._transfer_badge_from(from, to, badge_id)
        }

        /// Approves another account to transfer a specific badge
        #[ink(message)]
        pub fn approve_badge(&mut self, to: H160, badge_id: BadgeId) -> Result<(), Error> {
            let caller = self.env().caller();
            let badge = self.badges.get(badge_id).ok_or(Error::BadgeNotFound)?;

            if badge.owner != caller {
                return Err(Error::NotAuthorized);
            }

            self.badge_approvals.insert(badge_id, &to);

            self.env().emit_event(BadgeApproval {
                badge_id,
                owner: caller,
                approved: to,
            });

            Ok(())
        }

        /// Sets or unsets approval for all badges owned by the caller
        #[ink(message)]
        pub fn set_approval_for_all(&mut self, operator: H160, approved: bool) -> Result<(), Error> {
            let caller = self.env().caller();

            if caller == operator {
                return Err(Error::NotAllowed);
            }

            if approved {
                self.operator_approvals.insert((caller, operator), &());
            } else {
                self.operator_approvals.remove((caller, operator));
            }

            self.env().emit_event(ApprovalForAll {
                owner: caller,
                operator,
                approved,
            });

            Ok(())
        }

        // === QUERY FUNCTIONS ===

        /// Gets event information by ID
        #[ink(message)]
        pub fn get_event(&self, event_id: EventId) -> Option<Event> {
            self.events.get(event_id)
        }

        /// Gets badge information by ID
        #[ink(message)]
        pub fn get_badge(&self, badge_id: BadgeId) -> Option<Badge> {
            self.badges.get(badge_id)
        }

        /// Gets all badge IDs owned by an account
        #[ink(message)]
        pub fn get_owned_badges(&self, owner: H160) -> Vec<BadgeId> {
            self.owned_badges.get(owner).unwrap_or_default()
        }

        /// Gets all badge IDs for a specific event
        #[ink(message)]
        pub fn get_event_badges(&self, event_id: EventId) -> Vec<BadgeId> {
            self.event_badges.get(event_id).unwrap_or_default()
        }

        /// Gets the number of badges owned by an account
        #[ink(message)]
        pub fn balance_of(&self, owner: H160) -> u32 {
            self.owned_badges.get(owner).unwrap_or_default().len() as u32
        }

        /// Gets the owner of a specific badge
        #[ink(message)]
        pub fn owner_of(&self, badge_id: BadgeId) -> Option<H160> {
            self.badges.get(badge_id).map(|badge| badge.owner)
        }

        /// Gets the approved account for a specific badge
        #[ink(message)]
        pub fn get_approved(&self, badge_id: BadgeId) -> Option<H160> {
            self.badge_approvals.get(badge_id)
        }

        /// Checks if an operator is approved for all badges of an owner
        #[ink(message)]
        pub fn is_approved_for_all(&self, owner: H160, operator: H160) -> bool {
            self.operator_approvals.contains((owner, operator))
        }

        /// Checks if a user has a badge for a specific event
        #[ink(message)]
        pub fn has_badge_for_event(&self, user: H160, event_id: EventId) -> bool {
            self.user_event_badges.contains((event_id, user))
        }

        /// Gets the badge ID for a user's badge in a specific event (if any)
        #[ink(message)]
        pub fn get_user_badge_for_event(&self, user: H160, event_id: EventId) -> Option<BadgeId> {
            self.user_event_badges.get((event_id, user))
        }

        // === HELPER FUNCTIONS ===

        /// Internal function to handle badge transfers
        fn _transfer_badge_from(
            &mut self,
            from: H160,
            to: H160,
            badge_id: BadgeId,
        ) -> Result<(), Error> {
            let mut badge = self.badges.get(badge_id).ok_or(Error::BadgeNotFound)?;

            // Update badge owner
            badge.owner = to;
            self.badges.insert(badge_id, &badge);

            // Remove badge from sender's list
            let mut from_badges = self.owned_badges.get(from).unwrap_or_default();
            from_badges.retain(|&id| id != badge_id);
            self.owned_badges.insert(from, &from_badges);

            // Add badge to recipient's list
            let mut to_badges = self.owned_badges.get(to).unwrap_or_default();
            to_badges.push(badge_id);
            self.owned_badges.insert(to, &to_badges);

            // Clear any existing approval for this badge
            self.badge_approvals.remove(badge_id);

            // Update user event badge mapping
            self.user_event_badges.remove((badge.event_id, from));
            self.user_event_badges.insert((badge.event_id, to), &badge_id);

            self.env().emit_event(BadgeTransferred {
                badge_id,
                from,
                to,
            });

            Ok(())
        }
    }

    /// Unit tests
    #[cfg(test)]
    mod tests {
        use super::*;

        fn default_accounts() -> ink::env::test::DefaultAccounts<ink::env::DefaultEnvironment> {
            ink::env::test::default_accounts::<ink::env::DefaultEnvironment>()
        }

        fn set_caller(caller: H160) {
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(caller);
        }

        fn set_block_timestamp(timestamp: u64) {
            ink::env::test::set_block_timestamp::<ink::env::DefaultEnvironment>(timestamp);
        }

        #[ink::test]
        fn new_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let contract = DotPoap::new();
            assert_eq!(contract.owner(), accounts.alice);
            assert_eq!(contract.next_event_id(), 1);
            assert_eq!(contract.next_badge_id(), 1);
        }

        #[ink::test]
        fn create_event_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            let result = contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            );

            assert_eq!(result, Ok(1));
            assert_eq!(contract.next_event_id(), 2);

            let event = contract.get_event(1).unwrap();
            assert_eq!(event.name, "Test Event");
            assert_eq!(event.organizer, accounts.alice);
            assert_eq!(event.max_badges, 100);
            assert_eq!(event.minted_badges, 0);
            assert!(event.is_active);
        }

        #[ink::test]
        fn create_event_fails_with_invalid_input() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Empty name should fail
            let result = contract.create_event(
                "".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            );
            assert_eq!(result, Err(Error::InvalidInput));

            // Zero max badges should fail
            let result = contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                0,
                false,
            );
            assert_eq!(result, Err(Error::InvalidInput));
        }

        #[ink::test]
        fn update_event_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            // Update event
            let result = contract.update_event(
                1,
                Some("Updated Event".to_string()),
                Some("Updated description".to_string()),
                None,
                None,
                None,
            );
            assert_eq!(result, Ok(()));

            let event = contract.get_event(1).unwrap();
            assert_eq!(event.name, "Updated Event");
            assert_eq!(event.description, "Updated description");
        }

        #[ink::test]
        fn update_event_fails_unauthorized() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event as Alice
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            // Try to update as Bob
            set_caller(accounts.bob);
            let result = contract.update_event(
                1,
                Some("Updated Event".to_string()),
                None,
                None,
                None,
                None,
            );
            assert_eq!(result, Err(Error::NotAuthorized));
        }

        #[ink::test]
        fn mint_badge_for_user_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);
            set_block_timestamp(1000);

            let mut contract = DotPoap::new();

            // Create event
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            // Mint badge for Bob
            let result = contract.mint_badge_for_user(
                1,
                accounts.bob,
                "ipfs://badge1".to_string(),
            );
            assert_eq!(result, Ok(1));

            let badge = contract.get_badge(1).unwrap();
            assert_eq!(badge.owner, accounts.bob);
            assert_eq!(badge.event_id, 1);
            assert_eq!(badge.serial_number, 1);
            assert_eq!(badge.minted_at, 1000);

            // Check user has badge for event
            assert!(contract.has_badge_for_event(accounts.bob, 1));
            assert_eq!(contract.get_user_badge_for_event(accounts.bob, 1), Some(1));

            // Check badge counts
            assert_eq!(contract.balance_of(accounts.bob), 1);
            let event = contract.get_event(1).unwrap();
            assert_eq!(event.minted_badges, 1);
        }

        #[ink::test]
        fn claim_badge_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            // Bob claims badge
            set_caller(accounts.bob);
            let result = contract.claim_badge(1, "ipfs://badge1".to_string());
            assert_eq!(result, Ok(1));

            let badge = contract.get_badge(1).unwrap();
            assert_eq!(badge.owner, accounts.bob);
            assert_eq!(badge.event_id, 1);
        }

        #[ink::test]
        fn claim_badge_fails_already_has_badge() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            // Bob claims badge
            set_caller(accounts.bob);
            contract.claim_badge(1, "ipfs://badge1".to_string()).unwrap();

            // Bob tries to claim again
            let result = contract.claim_badge(1, "ipfs://badge2".to_string());
            assert_eq!(result, Err(Error::AlreadyHasBadge));
        }

        #[ink::test]
        fn transfer_badge_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event and mint badge for Bob
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            contract.mint_badge_for_user(
                1,
                accounts.bob,
                "ipfs://badge1".to_string(),
            ).unwrap();

            // Bob transfers badge to Charlie
            set_caller(accounts.bob);
            let result = contract.transfer_badge(1, accounts.charlie);
            assert_eq!(result, Ok(()));

            let badge = contract.get_badge(1).unwrap();
            assert_eq!(badge.owner, accounts.charlie);
            assert_eq!(contract.balance_of(accounts.bob), 0);
            assert_eq!(contract.balance_of(accounts.charlie), 1);

            // Check user event badge mapping updated
            assert!(!contract.has_badge_for_event(accounts.bob, 1));
            assert!(contract.has_badge_for_event(accounts.charlie, 1));
        }

        #[ink::test]
        fn approve_and_transfer_from_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event and mint badge for Bob
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            contract.mint_badge_for_user(
                1,
                accounts.bob,
                "ipfs://badge1".to_string(),
            ).unwrap();

            // Bob approves Charlie to transfer his badge
            set_caller(accounts.bob);
            contract.approve_badge(accounts.charlie, 1).unwrap();

            // Charlie transfers badge from Bob to himself
            set_caller(accounts.charlie);
            let result = contract.transfer_badge_from(accounts.bob, accounts.charlie, 1);
            assert_eq!(result, Ok(()));

            let badge = contract.get_badge(1).unwrap();
            assert_eq!(badge.owner, accounts.charlie);
        }

        #[ink::test]
        fn set_approval_for_all_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event and mint badge for Bob
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            contract.mint_badge_for_user(
                1,
                accounts.bob,
                "ipfs://badge1".to_string(),
            ).unwrap();

            // Bob sets Charlie as operator for all badges
            set_caller(accounts.bob);
            contract.set_approval_for_all(accounts.charlie, true).unwrap();

            assert!(contract.is_approved_for_all(accounts.bob, accounts.charlie));

            // Charlie can now transfer Bob's badge
            set_caller(accounts.charlie);
            let result = contract.transfer_badge_from(accounts.bob, accounts.charlie, 1);
            assert_eq!(result, Ok(()));
        }

        #[ink::test]
        fn max_badges_limit_works() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event with max 1 badge
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                1,
                false,
            ).unwrap();

            // Mint first badge
            contract.mint_badge_for_user(
                1,
                accounts.bob,
                "ipfs://badge1".to_string(),
            ).unwrap();

            // Try to mint second badge - should fail
            let result = contract.mint_badge_for_user(
                1,
                accounts.charlie,
                "ipfs://badge2".to_string(),
            );
            assert_eq!(result, Err(Error::MaxBadgesReached));
        }

        #[ink::test]
        fn inactive_event_prevents_claiming() {
            let accounts = default_accounts();
            set_caller(accounts.alice);

            let mut contract = DotPoap::new();

            // Create event
            contract.create_event(
                "Test Event".to_string(),
                "A test event".to_string(),
                "Nairobi".to_string(),
                1234567890,
                "ipfs://test".to_string(),
                100,
                false,
            ).unwrap();

            // Deactivate event
            contract.set_event_active(1, false).unwrap();

            // Bob tries to claim badge - should fail
            set_caller(accounts.bob);
            let result = contract.claim_badge(1, "ipfs://badge1".to_string());
            assert_eq!(result, Err(Error::EventNotActive));
        }
    }
}
