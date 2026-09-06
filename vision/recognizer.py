import math


# ============================================================
# BASIC GEOMETRY FUNCTIONS
# ============================================================

def distance(a, b):
    """Calculate distance between two landmarks."""

    return math.sqrt(
        (a.x - b.x) ** 2 +
        (a.y - b.y) ** 2
    )


def angle(a, b, c):
    """
    Calculate angle ABC in degrees.
    """

    ba_x = a.x - b.x
    ba_y = a.y - b.y

    bc_x = c.x - b.x
    bc_y = c.y - b.y

    dot_product = (
        ba_x * bc_x +
        ba_y * bc_y
    )

    magnitude_ba = math.sqrt(
        ba_x ** 2 +
        ba_y ** 2
    )

    magnitude_bc = math.sqrt(
        bc_x ** 2 +
        bc_y ** 2
    )

    if magnitude_ba == 0 or magnitude_bc == 0:
        return 0

    cosine = dot_product / (
        magnitude_ba *
        magnitude_bc
    )

    cosine = max(
        -1,
        min(1, cosine)
    )

    return math.degrees(
        math.acos(cosine)
    )


# ============================================================
# FINGER DETECTION
# ============================================================

def finger_is_extended(
    hand,
    mcp,
    pip,
    dip,
    tip
):
    """
    Determine whether a finger is extended
    using joint angles.
    """

    pip_angle = angle(
        hand[mcp],
        hand[pip],
        hand[dip]
    )

    dip_angle = angle(
        hand[pip],
        hand[dip],
        hand[tip]
    )

    return (
        pip_angle > 145
        and dip_angle > 145
    )


def thumb_is_extended(hand):
    """
    Determine whether the thumb is extended.
    """

    thumb_angle = angle(
        hand[2],
        hand[3],
        hand[4]
    )

    wrist_to_tip = distance(
        hand[0],
        hand[4]
    )

    wrist_to_ip = distance(
        hand[0],
        hand[3]
    )

    return (
        thumb_angle > 140
        and wrist_to_tip >
        wrist_to_ip * 1.10
    )


def get_finger_states(hand):
    """
    Returns:

    [Thumb, Index, Middle, Ring, Pinky]
    """

    thumb = thumb_is_extended(hand)

    index = finger_is_extended(
        hand,
        5,
        6,
        7,
        8
    )

    middle = finger_is_extended(
        hand,
        9,
        10,
        11,
        12
    )

    ring = finger_is_extended(
        hand,
        13,
        14,
        15,
        16
    )

    pinky = finger_is_extended(
        hand,
        17,
        18,
        19,
        20
    )

    return [
        thumb,
        index,
        middle,
        ring,
        pinky
    ]


# ============================================================
# PEACE SIGN
# ============================================================

def is_peace_sign(hand):
    """
    Detect an approximate ✌️ Peace/V sign.

    We intentionally use more tolerant geometry here
    because finger-angle calculations can vary depending
    on camera angle and hand rotation.
    """

    index_angle = angle(
        hand[5],
        hand[6],
        hand[8]
    )

    middle_angle = angle(
        hand[9],
        hand[10],
        hand[12]
    )

    ring_angle = angle(
        hand[13],
        hand[14],
        hand[16]
    )

    pinky_angle = angle(
        hand[17],
        hand[18],
        hand[20]
    )

    # Index and middle should be relatively straight
    index_extended = index_angle > 140
    middle_extended = middle_angle > 140

    # Ring and pinky should be bent
    ring_folded = ring_angle < 155
    pinky_folded = pinky_angle < 155

    # Index and middle fingertips should be separated
    fingertip_distance = distance(
        hand[8],
        hand[12]
    )

    palm_size = distance(
        hand[0],
        hand[9]
    )

    if palm_size == 0:
        return False

    fingers_separated = (
        fingertip_distance >
        palm_size * 0.35
    )

    return (
        index_extended
        and middle_extended
        and ring_folded
        and pinky_folded
        and fingers_separated
    )


# ============================================================
# THUMBS UP
# ============================================================

def is_thumbs_up(hand, fingers):

    thumb, index, middle, ring, pinky = fingers

    if not (
        thumb
        and not index
        and not middle
        and not ring
        and not pinky
    ):
        return False

    return (
        hand[4].y < hand[3].y
        and hand[4].y < hand[2].y
    )


# ============================================================
# THUMBS DOWN
# ============================================================

def is_thumbs_down(hand, fingers):

    thumb, index, middle, ring, pinky = fingers

    if not (
        thumb
        and not index
        and not middle
        and not ring
        and not pinky
    ):
        return False

    return (
        hand[4].y > hand[3].y
        and hand[4].y > hand[2].y
    )


# ============================================================
# OK GESTURE
# ============================================================

def is_ok_gesture(hand, fingers):

    thumb, index, middle, ring, pinky = fingers

    if not (
        middle
        and ring
        and pinky
    ):
        return False

    thumb_index_distance = distance(
        hand[4],
        hand[8]
    )

    palm_size = distance(
        hand[0],
        hand[9]
    )

    if palm_size == 0:
        return False

    return (
        thumb_index_distance <
        palm_size * 0.45
    )


# ============================================================
# MAIN GESTURE RECOGNITION
# ============================================================

def recognize_gesture(hand):
    """
    Prototype multi-gesture recognizer.

    NOTE:
    This is NOT a trained ISL/ASL model.
    """

    fingers = get_finger_states(hand)

    thumb, index, middle, ring, pinky = fingers


    # --------------------------------------------------------
    # PEACE SIGN
    # --------------------------------------------------------

    if is_peace_sign(hand):
        return "TWO / PEACE"


    # --------------------------------------------------------
    # OK
    # --------------------------------------------------------

    if is_ok_gesture(
        hand,
        fingers
    ):
        return "OK"


    # --------------------------------------------------------
    # THUMBS UP
    # --------------------------------------------------------

    if is_thumbs_up(
        hand,
        fingers
    ):
        return "THUMBS UP"


    # --------------------------------------------------------
    # THUMBS DOWN
    # --------------------------------------------------------

    if is_thumbs_down(
        hand,
        fingers
    ):
        return "THUMBS DOWN"


    # --------------------------------------------------------
    # FIST
    # --------------------------------------------------------

    if sum(fingers) == 0:
        return "FIST"


    # --------------------------------------------------------
    # ONE
    # --------------------------------------------------------

    if (
        not thumb
        and index
        and not middle
        and not ring
        and not pinky
    ):
        return "ONE"


    # --------------------------------------------------------
    # THREE
    # --------------------------------------------------------

    if (
        not thumb
        and index
        and middle
        and ring
        and not pinky
    ):
        return "THREE"


    # --------------------------------------------------------
    # FOUR
    # --------------------------------------------------------

    if (
        not thumb
        and index
        and middle
        and ring
        and pinky
    ):
        return "FOUR"


    # --------------------------------------------------------
    # OPEN PALM
    # --------------------------------------------------------

    if (
        thumb
        and index
        and middle
        and ring
        and pinky
    ):
        return "OPEN PALM"


    # --------------------------------------------------------
    # UNKNOWN
    # --------------------------------------------------------

    return "UNKNOWN"